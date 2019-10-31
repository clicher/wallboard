var config = {};

/**
 * 8x8 Information
 */
config.phoneSystemInformationForMap = {
  host: 'X',
  protocol: 'X',
  port: 443,
  method: 'GET',
  phoneSystemUsername: 'X',
  phoneSystemGetToken: 'X',
  mapData: {
    uri: '/api/stats/groups/111/activities.json?d=',
    pagination: 'true',
    paginationStart: 1,
    paginationInterval: 50,
  },
  rejected: {
    queues: ['Outbound'],
    mediatype: ['!Phone'],
    otherTags: ['trans-transfer-from'],
  },
  returnedFields: ['origination', 'trans-accept-time'],
};

config.areaCodeApiInformationForMap = {
  host: 'www.allareacodes.com',
  protocol: 'http://',
  port: 80,
  method: 'GET',
  uri: '/',
};

config.geoCodeLookup = {
  host: 'maps.googleapis.com',
  protocol: 'https://',
  port: 443,
  method: 'GET',
  uri: '/maps/api/geocode/json?address=',
  key: 'X',
};

config.databaseInformation = {
  host: 'localhost',
  port: '27017',
  dbname: 'wallboard',
};

config.realTimeStatistics = {
  phoneSystemInformation: {
    host: 'X',
    protocol: 'X',
    port: 443,
    method: 'GET',
    phoneSystemUsername: 'X',
    phoneSystemGetToken: 'X',
  },
  agent: {
    uri: '/api/rtstats/stats/agents.json',
    groupid: '111',
    returnedFields: ['agent-name', 'agent-status', 'time-in-status'],
    otherTags: [{'media-type': ['vmail']}],
  },
  queue: {
    uri: '/api/rtstats/stats/queues.json',
    rejectedVendors: [
      'Aruba Networks',
      'ASP Dump - Day',
      'Blue Coat',
      'Check Point',
      'Cisco',
      'Device Management ',
      'F5 Networks',
      'Fortinet',
      'Juniper Networks',
      'Outbound',
      'Palo Alto Networks',
      'Pulse Secure'],
    returnedFields: [
      'agent-count-busy',
      'agent-count-onBreak',
      'agent-count-postProcess',
      'agent-count-waitTransact',
      'agent-count-workOffline',
      'day-abandoned',
      'day-accepted',
      'day-avg-duration',
      'day-avg-wait-time',
      'queue-id',
      'queue-name'],
  },
};

module.exports = config;
