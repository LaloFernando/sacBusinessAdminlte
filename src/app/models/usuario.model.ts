export class Usuario{

    constructor(
        public US_CODCIA: string,
        public US_CODIGO: string,
        public US_PERMISO: string,
        public US_PASSWORD?: string,
        public PE_CODIGO?: string,
        public US_CODBODE?: string,
        public US_SERIEVTA?: string,
        public US_NOMBRE?: string,
        public US_EMAIL?:string,
        public US_ESTADO?:string,
    ){}
}