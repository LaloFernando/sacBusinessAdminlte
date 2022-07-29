export class Persona{

    constructor(
        public PE_CODCIA: string,
        public PE_CODIGO: string,
        public PE_CEDULA: string,
        public PE_NOMBRE: string,
        public PE_APELLIDO: string,
        public PE_DIRECCION: string,
        public PE_CIUDADNAC: string,
        public PE_JURIDICO: string,
        public PE_ESTADO: string,
        public PE_FPAGO:string,
        public PE_PLAZO:string,
        public PE_IDENTIFICACION: string,
        public PE_TIPOCLI:string,
        public PE_FAX: string,
        public PE_TELEFONO1?: string,
        public PE_EMAIL?: string,
    ){}
}

export class Plazo{

    constructor(
        public PLZ_CODI: string,
        public PLZ_DESCRIP: string,
    ){}
}

export class Ciudad{

    constructor(
        public SC_CODIGO: string,
        public SC_DESCRIPCION: string,
    ){}
}