import { PersonaService } from './../../../services/persona.service';
import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder} from '@angular/forms';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import   Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements AfterViewInit,OnInit {

  private subscription: Subscription = new Subscription;

  public titulo: string | undefined;
  
  displayedColumns: string[] = ['Codigo','Identificacion',  'Razon', 'Nombres', 'Direccion', 'Telefono', 'Email', 'Estado', 'Acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator 
  @ViewChild(MatSort) sort!: MatSort 

  constructor(private fb:FormBuilder, private router:Router, private personaSvc:PersonaService, public dialog: MatDialog) { 
    this.getArgumentos();
  }

  getArgumentos(){

    this.router.events
     .pipe(
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      )
      .subscribe(({ titulo }) => {
        this.titulo = titulo;
        document.title = `SacBusiness | ${titulo}`;
      })
  
  }

  ngOnInit(): void {
    this.obtenerPersona();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit():void{
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }

  obtenerPersona(){
    this.subscription.add(
      this.personaSvc.obtenerPersonas().subscribe((res: any) => {
        this.dataSource.data = res;
        })
    )
  }

  crearPersona(){
    localStorage.setItem('tipoPantalla', '1');
    this.router.navigate(['/dashboard/personas/person']);
  }

  editarPersona(id:string){
    localStorage.setItem('tipoPantalla', '2');
    localStorage.setItem('idPerson', id);
    this.router.navigate(['/dashboard/personas/person']);
  }

  eliminarPersona(id:string, nombre:string ){

    if (id == '1') {
      Swal.fire('Error', 'No puede eliminar Consumidor Final...!!', 'error');
    }else{
    
    Swal.fire({
      icon:'question',
      title:`Desea eliminar esta Persona...?`,
      html: nombre,
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then((result)=>{
        if (result.isConfirmed) {
          this.subscription.add(
            this.personaSvc.deletePersona(id).subscribe((res:any)=>{
              
              Swal.fire({
                icon:'success',
                title:'Persona eliminado correctamente',
                confirmButtonText:'Ok'            
              }).then((result)=>{
                  
                if (result) {
                  this.obtenerPersona();
                }
    
              });
    
            }, (err)=>{
              Swal.fire('Error', err.error.message, 'error')
            })
          );
        }      

    });
 } 

  }

  
  // downloadPDF() {
  //   const DATA = document.getElementById('htmlData');
  //   const doc = new jsPDF('p', 'pt', 'a4');
  //   const options = {
  //     background: 'white',
  //     scale: 3
  //   };
  //   html2canvas(DATA!, options).then((canvas) => {

  //     const img = canvas.toDataURL('image/PNG');

  //     // Add image Canvas to PDF
  //     const bufferX = 15;
  //     const bufferY = 15;
  //     const imgProps = (doc as any).getImageProperties(img);
  //     const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //     doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
  //     return doc;
  //   }).then((docResult) => {
  //     docResult.save(`${new Date().toISOString()}_personas.pdf`);
  //     // docResult.output("dataurlnewwindow")
  //   });
  // }


  generatePdf() {
    let pdf = new jsPDF();

    let persons:any = this.dataSource.data;
    let detTableData:any = [];
    let tableData:any [] = [];

    let eNomComercial:any = localStorage.getItem('eNomComercial');
    let user:any = localStorage.getItem('user');
    let logo = new Image();
    logo.src = '../../assets/dist/img/logo.png';
    let logoSystem = new Image();
    logoSystem.src = '../../assets/dist/img/newsystemok.png';

    persons.forEach((element: { [x: string]: any; }) =>{
      detTableData.push(element['PE_CEDULA']);
      if (element['PE_APELLIDO'] !== ''){
        detTableData.push(element['PE_NOMBRE']+' ('+element['PE_APELLIDO']+')');
      }else{
        detTableData.push(element['PE_NOMBRE']);
      }
      detTableData.push(element['PE_DIRECCION']);
      detTableData.push(element['PE_TELEFONO1']);
      detTableData.push(element['PE_EMAIL']);
      detTableData.push(element['PE_ESTADO']);

      tableData.push(detTableData);
      detTableData = [];
    } );

    (pdf as any).autoTable({
    head: [['Identificacion',  'Razon Social/Nombre Comercial', 'Direccion', 'Telefono', 'Email', 'Estado']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 8 },
    columnStyles: { 
      0: { halign: 'left', cellWidth: 25 },
      1: { halign: 'left', cellWidth: 45 },
      2: { halign: 'left', cellWidth: 45 },
      5: { halign: 'center'}}, // Cells in first column centered and green
    margin: { top: 18 },
    // startY: 18,
    // showHead: 'firstPage',
    footStyles:{},
    didDrawCell: (data:any) => {
      if (data.section === 'body' && data.column.index === 0) {
        // var base64Img = 'data:image/jpeg;base64,iVBORw0KGgoAAAANS...'
        // pdf.addImage(base64Img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 10, 10)
      }
    },
    didDrawPage: (data:any) => {
      
      // pdf.setDrawColor(0);
      pdf.setFillColor(69,82,121);
      pdf.rect(10, 285, 190, 8, 'FD'); // filled red square with black borders
      pdf.addImage(logo, 'PNG', 10, 2 ,15,15);
      pdf.addImage(logoSystem, 'PNG', 11, 286 ,25,6);
      pdf.setFontSize(14);
      pdf.text('Lista de Personas',  75, 14);
      pdf.setFontSize(7);
      pdf.text(eNomComercial,  35, 8);
      pdf.text('Usuario: ' + user,  160, 12);
      pdf.text('Fecha: ' + new Date().toISOString(),  160, 8);
      pdf.setTextColor(236,237,241);
      pdf.text('Pág.# ' + data.pageNumber.toString(),  180,  290);
      
      }
    })

    // Open PDF document in browser's new tab
    // pdf.output('dataurlnewwindow')
    
    // Download PDF doc  
    pdf.save(`${new Date().toISOString()}_personas.pdf`);

}
  


// generatePDF() {  
//   let docDefinition = {  
//     header: 'C#Corner PDF Header',  
//     content: 'Sample PDF generated with Angular and PDFMake for C#Corner Blog'  
//   };  
 
//   pdfMake.createPdf(docDefinition).open();  
// }

}
