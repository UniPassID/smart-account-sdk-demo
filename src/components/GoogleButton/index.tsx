import { useGoogleLogin } from "@react-oauth/google";
import { LocalMpcStorage, MpcSigner, MpcRunningEnv } from "@unipasswallet/smart-account";
import './index.css'

function GoogleButton() {

  const connect = useGoogleLogin({
    onSuccess: async tokenResponse => {
      // exchange id_token or access_token by code
      // This interface should be implemented on the server side, and is only used as a demo reference here.
      const data = {
        code: tokenResponse.code,
        client_id: '463402777513-skhs1og4clv62qr04dk64icgms5keql6.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost:3000',
        grant_type: 'authorization_code'
      }
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data)
      })
        .then(response => response.json());

      const signer = new MpcSigner({
        storage: LocalMpcStorage,
      });
      
      // If initalized by reading from storage.
      // await signer.init();
      
      // If initalized by id token.
      await signer.init({
        idToken: res.id_token,
        noStorage: true,
        runningEnv: MpcRunningEnv.Dev,
        appId: '7941978fed0b552181cc8e6ca5faec03',
      });

    },
    flow: 'auth-code'
  })

  return (
    <div className="google-button" onClick={() => connect()}>
      <div className="google-icon"></div><div> Connect With Google </div>
    </div>
  );
}

export default GoogleButton;
