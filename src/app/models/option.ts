export class Option {
  option: string;
  section: string;
  value: any;
}

// use string as constant instead of complex type to avoid changing it through a reference
export const DEFAULT_NOTIFICATION_EMAIL = {
  option: 'notifications',
  section: 'email',
  value: '{"smtp_username":"", "smtp_password":"", "email_address": ""}'
};

export const DEFAULT_NOTIFICATION_GSM = {
  option: 'notifications',
  section: 'gsm',
  value: {
    pin_code: '',
    phone_number: ''
  }
};

export const DEFAULT_NOTIFICATION_SUBSCRIPTIONS = {
  option: 'notifications',
  section: 'subscriptions',
  value: {
    email: {
      alert_started: false,
      alert_stopped: false
    },
    sms: {
      alert_started: false,
      alert_stopped: false
    }
  }
};


// use string as constant instead of complex type to avoid changing it through a reference
export const DEFAULT_NOTIFICATION_DYNDNS = {
  option: 'network',
  section: 'dyndns',
  value: {
    username: '',
    password: '',
    hostname: '',
    provider: '',
    restrict_host: ''
  }
};

export const DEFAULT_NOTIFICATION_ACCESS = {
  option: 'network',
  section: 'access',
  value: {
    ssh: false
  }
};
