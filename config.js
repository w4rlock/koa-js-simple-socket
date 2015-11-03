var configuration = {
  // +++++++++++++++++++++++++++++++++++++++++++ DESARROLLO CONFIG ++++++++++++++++++++++++++++++
  development: {
    MAIL: { 
      auth: {
        user: 'developer@rockboxstudios.com',
        pass: 'r0ckb0xstud10s',
      },
      service: 'gmail'
    },

    APP: {
      SECRET: '4$4bmQH23+$IFTRMv34R5seffeceE0EmC8YQ4o$',
      PORT: process.env.PORT || 6661,
      TOKEN_EXPIRE: 60*36, //36 horas
      TMP_DIR: '/tmp/'
    },

    AUTH: {
      TWITTER: { 
        consumerKey: '79B1J37pFygmRI4i53bgJATRg',
        consumerSecret: '9epB63wMPGNyPSMtTQ9zSvwczK7DTw7Yhfmhx0JrtPfMgpsSTq',
        //callbackURL: domain + "/auth/twitter/callback" 
     },

      FACEBOOK: { 
        clientID: '384015628417206',
        clientSecret: 'd550697ccfbfe7bca4114aa355dd23bc', 
        //callbackURL: domain + "/auth/facebook/callback",
        profileFields: [ 'email','gender', 'birthday','id', 'first_name','last_name', 'picture']
     },

      GOOGLE: { 
        clientId: '850401798283-ngvfvtnqimai13hhns75gtci0q3lv93f.apps.googleusercontent.com',
        clientSecret: 'pdCyzp6JSl2NaZ-JuLJyAFgB',
        //callbackURL: domain + "/auth/google/callback" 
     }
    }
  },

  // +++++++++++++++++++++++++++++++++++++++++++ PRODUCTION CONFIG ++++++++++++++++++++++++++++++
  production: {
    MAIL: { 
      auth: {
        user: 'developer@rockboxstudios.com',
        pass: 'r0ckb0xstud10s'
      },
      service: 'gmail'
    },

    APP: {
      SECRET: '4$4bmQH23+$IFTRMv34R5seffeceE0EmC8YQ4o$',
      PORT: process.env.PORT || 8082,
      TOKEN_EXPIRE: 60*36, //36 horas
      TMP_DIR: '/tmp/'
    },

    AUTH: {
      TWITTER: { 
        consumerKey: '79B1J37pFygmRI4i53bgJATRg',
        consumerSecret: '9epB63wMPGNyPSMtTQ9zSvwczK7DTw7Yhfmhx0JrtPfMgpsSTq',
        //callbackURL: domain + "/auth/twitter/callback" 
      },

      FACEBOOK: { 
        clientID: '384015628417206',
        clientSecret: 'd550697ccfbfe7bca4114aa355dd23bc', 
        //callbackURL: domain + "/auth/facebook/callback",
        profileFields: [ 'email','gender', 'birthday','id', 'first_name','last_name', 'picture']
      },

      GOOGLE: { 
        clientId: '850401798283-ngvfvtnqimai13hhns75gtci0q3lv93f.apps.googleusercontent.com',
        clientSecret: 'pdCyzp6JSl2NaZ-JuLJyAFgB',
        //callbackURL: domain + "/auth/google/callback" 
     }
    }
  }
};

module.exports = mode => {
	mode = mode || 'development';
  return global.cfg = configuration[mode];
}
