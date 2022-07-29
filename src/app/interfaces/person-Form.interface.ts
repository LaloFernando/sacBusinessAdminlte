export interface PersonForm{
    PE_CODCIA: string;
    PE_CEDULA: string;
    PE_NOMBRE: string;
    PE_APELLIDO: string;
    PE_DIRECCION: string;
    PE_TELEFONO1: string;
    PE_FAX: string;
    PE_CIUDADNAC: string;
    PE_EMAIL: string;
    PE_ESTADO: string;
    PE_IDENTIFICACION: string;
    PE_FPAGO:string;
    PE_PLAZO:string;
    PE_TIPOCLI:string;
}

export interface PersonPlazo{
    PLZ_CODI: string;
    PLZ_DESCRIP: string;
}

export interface PersonCiudad{
    SC_CODIGO: string;
    SC_DESCRIPCION: string;
}