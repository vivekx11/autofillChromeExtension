// Content script for Auto Form Filler extension
console.log('🚀 Auto Form Filler: Content script loaded!');
// Class instantiation: Creates the AutoFormFiller object to manage form auto-filling functionality

class AutoFormFiller {
  constructor() {
    this.isEnabled = true;
    this.userData = {};
    this.observerActive = false;
    
    console.log('🚀 Auto Form Filler: Initializing...');
    this.init();
  }
    // Initialization method to set up event listeners and load stored user data

  async init() {
    try {
      // Load user data from storage
      await this.loadUserData();
      
      // Set up form detection
      this.setupFormDetection();
      
      // Listen for keyboard shortcuts
      this.setupKeyboardShortcuts();
      
      // Listen for messages from popup
      this.setupMessageListener();
      
      console.log('Auto Form Filler: Content script initialized');
    } catch (error) {
      console.error('Auto Form Filler: Initialization error:', error);
    }
  }

  async loadUserData() {
    try {
      const result = await chrome.storage.local.get([
        'fullName', 'email', 'phone', 'address', 
        'resume', 'linkedin', 'github'
      ]);
      
      this.userData = result;
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  setupFormDetection() {
    // Detect forms on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.detectAndProcessForms();
      });
    } else {
      this.detectAndProcessForms();
    }

    // Watch for dynamically added forms
    this.setupMutationObserver();
  }

  setupMutationObserver() {
    if (this.observerActive) return;

    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === 'FORM' || node.querySelector('form')) {
                shouldCheck = true;
              }
            }
          });
        }
      });

      if (shouldCheck) {
        setTimeout(() => this.detectAndProcessForms(), 500);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.observerActive = true;
  }

  detectAndProcessForms() {
    console.log('🔍 Auto Form Filler: Detecting forms...');
    const forms = document.querySelectorAll('form');
    console.log(`🔍 Found ${forms.length} forms on page`);
    
    forms.forEach((form, index) => {
      if (form.dataset.autoFillerProcessed) return;
      
      const formFields = this.analyzeForm(form);
      console.log(`📝 Form ${index + 1}: Found ${formFields.length} compatible fields`, formFields);
      
      if (formFields.length > 0) {
        this.addFillButton(form, formFields, index);
        form.dataset.autoFillerProcessed = 'true';
        console.log(`✅ Added fill button to form ${index + 1}`);
      }
    });
  }

  analyzeForm(form) {
    const fields = [];
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Skip password, hidden, submit, and button fields
      if (['password', 'hidden', 'submit', 'button', 'reset'].includes(input.type)) {
        return;
      }

      const fieldInfo = this.identifyField(input);
      if (fieldInfo) {
        fields.push({
          element: input,
          dataKey: fieldInfo.dataKey,
          confidence: fieldInfo.confidence
        });
      }
    });

    return fields;
  }

  identifyField(element) {
    const fieldMappings = {
      fullName: {
        patterns: ['name', 'fullname', 'full-name', 'full_name', 'username', 'applicant-name', 'candidate-name', 'first-name', 'lastname'],
        weight: 1
      },
      email: {
        patterns: ['email', 'e-mail', 'email-address', 'emailaddress', 'mail', 'user-email'],
        weight: 1
      },
      phone: {
        patterns: ['phone', 'telephone', 'mobile', 'cell', 'phone-number', 'phonenumber', 'contact'],
        weight: 1
      },
      address: {
        patterns: ['address', 'street', 'location', 'addr', 'full-address', 'mailing-address'],
        weight: 1
      },
      resume: {
        patterns: ['resume', 'cv', 'portfolio', 'resume-link', 'cv-link'],
        weight: 0.8
      },
      linkedin: {
        patterns: ['linkedin', 'linkedin-profile', 'linkedin-url'],
        weight: 0.8
      },
      github: {
        patterns: ['github', 'github-profile', 'github-url', 'git'],
        weight: 0.8
      }
    };

    let bestMatch = null;
    let highestScore = 0;

    Object.keys(fieldMappings).forEach(dataKey => {
      const mapping = fieldMappings[dataKey];
      let score = 0;

      // Check name attribute
      if (element.name) {
        mapping.patterns.forEach(pattern => {
          if (element.name.toLowerCase().includes(pattern)) {
            score += mapping.weight * 0.4;
          }
        });
      }

      // Check id attribute
      if (element.id) {
        mapping.patterns.forEach(pattern => {
          if (element.id.toLowerCase().includes(pattern)) {
            score += mapping.weight * 0.3;
          }
        });
      }

      // Check placeholder
      if (element.placeholder) {
        mapping.patterns.forEach(pattern => {
          if (element.placeholder.toLowerCase().includes(pattern)) {
            score += mapping.weight * 0.2;
          }
        });
      }

      // Check type attribute for email and tel
      if (dataKey === 'email' && element.type === 'email') {
        score += mapping.weight * 0.5;
      }
      if (dataKey === 'phone' && element.type === 'tel') {
        score += mapping.weight * 0.5;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = {
          dataKey: dataKey,
          confidence: score
        };
      }
    });

    return highestScore > 0.2 ? bestMatch : null;
  }

  addFillButton(form, fields, formIndex) {
    // Check if user has saved data
    const hasData = Object.values(this.userData).some(value => value && value.trim());
    console.log('💾 User has saved data:', hasData, this.userData);
    
    if (!hasData) {
      console.log('⚠️ No user data found, skipping button creation');
      return;
    }

    // Create fill button
    const fillButton = document.createElement('div');
    fillButton.innerHTML = `
      <div style="
        position: relative;
        display: inline-block;
        margin: 10px 0;
      ">
        <button type="button" style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" 
           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
          🚀 Auto Fill Form
        </button>
      </div>
    `;

    const button = fillButton.querySelector('button');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('🎯 Fill button clicked!');
      this.fillForm(fields);
    });

    // Insert button at the beginning of the form
    form.insertBefore(fillButton, form.firstChild);
    console.log('✅ Fill button added to DOM');
  }

    // Fill form fields with matching user data and trigger change events for validation
  fillForm(fields) {
    let filledCount = 0;

    fields.forEach(field => {
      const { element, dataKey } = field;
      const value = this.userData[dataKey];

      if (value && value.trim() && !element.value) {
        element.value = value;
        
        // Trigger events to ensure the form recognizes the change
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
        
        // Add visual feedback
        element.style.transition = 'background-color 0.3s';
        element.style.backgroundColor = '#e8f5e8';
        
        setTimeout(() => {
          element.style.backgroundColor = '';
        }, 2000);

        filledCount++;
      }
    });

    // Show success notification
    this.showNotification(
      filledCount > 0 
        ? `✅ ${filledCount} field(s) filled successfully!`
        : '⚠️ No empty fields found to fill',
      filledCount > 0 ? 'success' : 'warning'
    );
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+F (or Cmd+Shift+F on Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        this.fillAllFormsOnPage();
      }
    });
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'fillForms') {
        this.fillAllFormsOnPage();
        sendResponse({ success: true });
      }
    });
  }

  async fillAllFormsOnPage() {
    // Reload user data to get latest
    await this.loadUserData();
    
    const hasData = Object.values(this.userData).some(value => value && value.trim());
    if (!hasData) {
      this.showNotification('⚠️ Please save your data in the extension popup first', 'warning');
      return;
    }

    let totalFilled = 0;
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      const fields = this.analyzeForm(form);
      if (fields.length > 0) {
        fields.forEach(field => {
          const { element, dataKey } = field;
          const value = this.userData[dataKey];

          if (value && value.trim() && !element.value) {
            element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Visual feedback
            element.style.transition = 'background-color 0.3s';
            element.style.backgroundColor = '#e8f5e8';
            
            setTimeout(() => {
              element.style.backgroundColor = '';
            }, 2000);

            totalFilled++;
          }
        });
      }
    });

    this.showNotification(
      totalFilled > 0 
        ? `✅ Auto filled ${totalFilled} field(s) across all forms!`
        : '⚠️ No compatible empty fields found on this page',
      totalFilled > 0 ? 'success' : 'warning'
    );
  }

    // Display styled notification with auto-dismiss animation after form filling operations
  showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.auto-filler-notification');
    existing.forEach(el => el.remove());

    const notification = document.createElement('div');
    notification.className = 'auto-filler-notification';
    
    const bgColor = type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#dc3545';
    const textColor = type === 'warning' ? '#212529' : 'white';
    
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
      ">
        ${message}
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }
}

// Initialize the auto form filler
// Checks if DOM is still loading before creating the auto form filler instance
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AutoFormFiller();
  });
} else {
  new AutoFormFiller();
}

// Listen for keyboard shortcut commands
chrome.commands?.onCommand.addListener((command) => {
  if (command === 'fill-form') {
    const autoFiller = new AutoFormFiller();
    autoFiller.fillAllFormsOnPage();
  }

});
