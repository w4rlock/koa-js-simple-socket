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
      DB: { dialect: 'sqlite', storage: __dirname+ '/picoresa.sqlite'},
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
    },

    AWS: {
      accessKeyId: 'AKIAIX3YLYOZ5RYME2AA',
      secretAccessKey: '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',
      region: 'sa-east-1', 
      Bucket: 'web.picoresa.com'
    },

    MP: {
      KEY: 6106,
      SECRET: 'dia5WEglTjC5CVEpo9NliBwYDhiq42Ay',
      PAGE_CONFIG: '/checkout/preferences?access_token=',
      PICTURE_URL: 'http://web.picoresa.com.s3.amazonaws.com/assets/img/conjunto_para_MP2.jpg',
      back_urls: {
        pending: 'http://localhost:6661/pago_pendiente',
        success: 'http://localhost:6661/compra_finalizada'
      }
    }
  },

  // +++++++++++++++++++++++++++++++++++++++++++ PRODUCTION CONFIG ++++++++++++++++++++++++++++++
  production: {
    MAIL: { 
      auth: {
        user: 'ayuda@picoresa.com',
        pass: 'ojdfklnfdgs',
      },
      service: 'gmail'
    },

    APP: {
      SECRET: '4$4bmQH23+$IFTRMv34R5seffeceE0EmC8YQ4o$',
      DB: { dialect: 'sqlite', storage: __dirname+ '/picoresa.sqlite'},
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
    },

    AWS: {
      accessKeyId: 'AKIAIX3YLYOZ5RYME2AA',
      secretAccessKey: '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',
      region: 'sa-east-1', 
      Bucket: 'web.picoresa.com'
    },

    MP: {
      KEY: 6106,
      SECRET: 'dia5WEglTjC5CVEpo9NliBwYDhiq42Ay',
      PAGE_CONFIG: '/checkout/preferences?access_token=',
      PICTURE_URL: 'http://web.picoresa.com.s3.amazonaws.com/assets/img/conjunto_para_MP2.jpg',
      back_urls: {
        pending: 'http://new.picoresa.com/pago_pendiente',
        success: 'http://new.picoresa.com/compra_finalizada'
      }
    }
  }
};

module.exports = mode => {
	mode = mode || 'development';
  return global.cfg = configuration[mode];
}
