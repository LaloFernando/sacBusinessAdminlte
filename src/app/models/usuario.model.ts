export class Usuario{

    constructor(

        public US_CODIGO: string,
        public US_PERMISO: string,
        public US_PASSWORD?: string,
        public PE_CODIGO?: string,
        public US_FECHAINI?: string
    ){}
}