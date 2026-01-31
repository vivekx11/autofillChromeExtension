// Popup script for Auto Form Filler extension
class PopupManager {
  constructor() {
    this.form = document.getElementById('userDataForm');
    this.clearBtn = document.getElementById('clearBtn');
    this.fillNowBtn = document.getElementById('fillNowBtn');
    this.status = document.getElementById('status');
    
    this.init();
  }

  init() {
    this.loadSavedData();
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Save form data
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveUserData();
    });

    // Clear all data
    this.clearBtn.addEventListener('click', () => {
      this.clearAllData();
    });

    // Fill current page
    this.fillNowBtn.addEventListener('click', () => {
      this.fillCurrentPage();
    });
  }

  async loadSavedData() {
    try {
      const result = await chrome.storage.local.get([
        'fullName', 'email', 'phone', 'address', 
        'resume', 'linkedin', 'github'
      ]);

      // Populate form fields with saved data
      Object.keys(result).forEach(key => {
        const element = document.getElementById(key);
        if (element && result[key]) {
          element.value = result[key];
        }
      });
    } catch (error) {
      console.error('Error loading saved data:', error);
      this.showStatus('Error loading saved data', 'error');
    }
  }

  async saveUserData() {
    try {
      const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        resume: document.getElementById('resume').value.trim(),
        linkedin: document.getElementById('linkedin').value.trim(),
        github: document.getElementById('github').value.trim()
      };

      // Validate required fields
      if (!formData.fullName || !formData.email) {
        this.showStatus('Please fill in at least Name and Email', 'error');
        return;
      }

      // Validate email format
      if (!this.isValidEmail(formData.email)) {
        this.showStatus('Please enter a valid email address', 'error');
        return;
      }

      // Save to chrome storage
      await chrome.storage.local.set(formData);
      
      this.showStatus('Data saved successfully! 🎉', 'success');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        this.hideStatus();
      }, 3000);

    } catch (error) {
      console.error('Error saving data:', error);
      this.showStatus('Error saving data. Please try again.', 'error');
    }
  }

  async clearAllData() {
    if (confirm('Are you sure you want to clear all saved data?')) {
      try {
        await chrome.storage.local.clear();
        
        // Clear form fields
        this.form.reset();
        
        this.showStatus('All data cleared successfully', 'success');
        
        setTimeout(() => {
          this.hideStatus();
        }, 2000);

      } catch (error) {
        console.error('Error clearing data:', error);
        this.showStatus('Error clearing data', 'error');
      }
    }
  }

  async fillCurrentPage() {
    try {
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        this.showStatus('No active tab found', 'error');
        return;
      }

      // Check if we have saved data
      const userData = await chrome.storage.local.get([
        'fullName', 'email', 'phone', 'address', 
        'resume', 'linkedin', 'github'
      ]);

      if (!userData.fullName && !userData.email) {
        this.showStatus('Please save your data first', 'error');
        return;
      }

      // Inject content script and fill forms
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: this.fillFormsOnPage,
        args: [userData]
      });

      this.showStatus('Form filling initiated! Check the page.', 'success');
      
      // Close popup after successful fill
      setTimeout(() => {
        window.close();
      }, 1500);

    } catch (error) {
      console.error('Error filling current page:', error);
      this.showStatus('Error filling page. Please try again.', 'error');
    }
  }

  // This function will be injected into the page
  fillFormsOnPage(userData) {
    // This function runs in the context of the web page
    const fieldMappings = {
      fullName: ['name', 'fullname', 'full-name', 'full_name', 'username', 'applicant-name', 'candidate-name'],
      email: ['email', 'e-mail', 'email-address', 'emailaddress', 'mail', 'user-email'],
      phone: ['phone', 'telephone', 'mobile', 'cell', 'phone-number', 'phonenumber', 'contact'],
      address: ['address', 'street', 'location', 'addr', 'full-address', 'mailing-address'],
      resume: ['resume', 'cv', 'portfolio', 'resume-link', 'cv-link'],
      linkedin: ['linkedin', 'linkedin-profile', 'linkedin-url'],
      github: ['github', 'github-profile', 'github-url', 'git']
    };

    let filledCount = 0;

    // Find and fill form fields
    Object.keys(fieldMappings).forEach(dataKey => {
      if (!userData[dataKey]) return;

      const patterns = fieldMappings[dataKey];
      
      patterns.forEach(pattern => {
        // Find by name attribute
        const nameFields = document.querySelectorAll(`input[name*="${pattern}" i], textarea[name*="${pattern}" i]`);
        nameFields.forEach(field => {
          if (field.type !== 'password' && field.type !== 'hidden' && !field.value) {
            field.value = userData[dataKey];
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            filledCount++;
          }
        });

        // Find by placeholder
        const placeholderFields = document.querySelectorAll(`input[placeholder*="${pattern}" i], textarea[placeholder*="${pattern}" i]`);
        placeholderFields.forEach(field => {
          if (field.type !== 'password' && field.type !== 'hidden' && !field.value) {
            field.value = userData[dataKey];
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            filledCount++;
          }
        });

        // Find by id
        const idFields = document.querySelectorAll(`input[id*="${pattern}" i], textarea[id*="${pattern}" i]`);
        idFields.forEach(field => {
          if (field.type !== 'password' && field.type !== 'hidden' && !field.value) {
            field.value = userData[dataKey];
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            filledCount++;
          }
        });
      });
    });

    // Show notification
    if (filledCount > 0) {
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #28a745;
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ✅ Auto Form Filler: ${filledCount} field(s) filled successfully!
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 4000);
    } else {
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ffc107;
          color: #212529;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ⚠️ No compatible form fields found on this page
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 4000);
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showStatus(message, type) {
    this.status.textContent = message;
    this.status.className = `status ${type}`;
    this.status.style.display = 'block';
  }

  hideStatus() {
    this.status.style.display = 'none';
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});