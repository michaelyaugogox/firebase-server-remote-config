import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class RemoteConfigService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const app = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        type: 'service_account',
        project_id: this.configService.get<string>('firebase.projectId'),
        private_key_id: this.configService.get<string>('firebase.privateKeyId'),
        private_key: this.configService.get<string>('firebase.privateKey'),
        client_email: this.configService.get<string>('firebase.clientEmail'),
        client_id: this.configService.get<string>('firebase.clientId'),
        client_x509_cert_url: this.configService.get<string>(
          'firebase.clientX509CertUrl',
        ),
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        universe_domain: 'googleapis.com',
      } as firebaseAdmin.ServiceAccount),
    });

    const remoteConfig = app.remoteConfig();

    const serverTemplate = await remoteConfig.getServerTemplate();
    const serverConfig = serverTemplate.evaluate({
      version: '0.0.2',
    });

    const stringValue = serverConfig.getString('string_value');
    const boolValue = serverConfig.getBoolean('boolean_value');
    const numberValue = serverConfig.getNumber('number_value');
    const jsonValue = serverConfig.getValue('json_value').asString();

    console.log('stringValue:  ', stringValue);
    console.log('boolValue:  ', boolValue);
    console.log('numberValue:  ', numberValue);
    console.log('jsonValue:  ', jsonValue);
  }
}
