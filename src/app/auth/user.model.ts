export class User{
    constructor(
        public email: string,
        public id: string,
        private _token: string, // token is the property that we want to access from outside but we want to access it through a method
        private _tokenExpirationDate: Date // token expiration date is the property that we want to access from outside but we want to access it through a method
    ){}

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){ // if the token is expired
            return null;
        }
        return this._token;
    }
}