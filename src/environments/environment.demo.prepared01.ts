// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=demo` then `environment.demo.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  demo: true,
  delay: 100,

  channel_count: 15,
  SNACK_DURATION: 2000,

  MONITORING_PORT: 8081,

  DEFAULT_LANGUAGE: 'en',
  LANGUAGES: 'hu',

  // monitoring arm types
  ARM_AWAY: 'away',
  ARM_STAY: 'stay',
  ARM_DISARM: 'disarm',

  // monitoring system states
  MONITORING_STARTUP: 'monitoring_startup',
  MONITORING_READY: 'monitoring_ready',
  MONITORING_UPDATING_CONFIG: 'monitoring_updating_config',
  MONITORING_INVALID_CONFIG: 'monitoring_invalid_config',
  MONITORING_ARMED: 'monitoring_armed',
  MONITORING_SABOTAGE: 'monitoring_sabotage',

  ROLE_TYPES : {
    ADMIN: 'admin',
    USER: 'user'
  }
};

export const SENSORS = [
  {
    id: 0,
    channel: 1,
    zone_id: 0,
    type_id: 0,
    alert: false,
    description: 'Teszt',
    enabled: true
  }
];

export const ZONES = [
  {
    id: 0,
    name: 'Hall',
    disarmed_delay: null,
    away_delay: 0,
    stay_delay: 0,
    description: ''
  }
];
