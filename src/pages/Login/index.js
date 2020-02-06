import template from './login.hbs';
import { getClientID, getRedirectUrl, getTopTracks } from '../../modules/api';



export default class LoginPage {
    constructor(root) {
        console.log('Login Page');
        this.root = root;
        this.template = template;
    }


    render() {
        this.root.innerHTML = this.template({ clientID: getClientID, redirectUrl: getRedirectUrl });
        this.bind();
    }


    bind() { //for my event Listeners
        sessionStorage.clear();
        const noHeader = document.getElementById('header').classList.add('noHeader');

        const noAuthenticateButton = document.querySelector("#withoutLogin") //get LoginWithout Authentifaction
        console.log(noAuthenticateButton)
        noAuthenticateButton.addEventListener("click", function () {
            sessionStorage.setItem("userAccessTokken", "withoutTokken"); //set token to not authenticated
            sessionStorage.setItem("Time", new Date())
            console.log("inside event Listener")
            document.location = '/index'; return false;
        })
    }

}
