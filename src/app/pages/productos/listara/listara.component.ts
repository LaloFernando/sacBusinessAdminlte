import { ProductoService } from './../../../services/producto.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder} from '@angular/forms';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import   Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { environment } from '../../../../environments/environment';
import html2canvas from 'html2canvas';

const URL = environment.urlServer;

@Component({
  selector: 'app-listara',
  templateUrl: './listara.component.html',
  styleUrls: ['./listara.component.css']
})
export class ListaraComponent implements OnInit {

  private subscription: Subscription = new Subscription;

  public titulo: string | undefined;

  public pathImage: string = '';
  
  displayedColumns: string[] = ['Id','Codigo',  'Auxiliar', 'Img', 'Descripcion', 'Stock', 'Precio', 'Tipo', 'Iva', 'Estado', 'Acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator 
  @ViewChild(MatSort) sort!: MatSort 

  constructor(private fb:FormBuilder, private router:Router, private productoSvc:ProductoService) { 
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
    this.obtenerProducto();
    this.pathImage =  `${URL}/products/products/`; 
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

  obtenerProducto(){

    this.subscription.add(
      this.productoSvc.obtenerProductos().subscribe((res: any) => {
        this.dataSource.data = res.productos;
        })
    )
  }

  crearProducto(){
    localStorage.setItem('tipoPantalla', '1')
    this.router.navigate(['/dashboard/productos/product']);
  }

  editarProducto(id:string, nomImgProduct:string){
    localStorage.setItem('tipoPantalla', '2');
    localStorage.setItem('idProduct', id);
    localStorage.setItem('nomImgProduct', nomImgProduct);
    this.router.navigate(['/dashboard/productos/product']);
  }

  eliminarProducto(id:string, nombre:string, nomImgProduct:string ){

    Swal.fire({
      icon:'question',
      title:`Desea eliminar este producto... ?`,
      html: nombre ,
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then((result)=>{
        if (result.isConfirmed) {
          this.subscription.add(
            this.productoSvc.deleteProducto(id, nomImgProduct).subscribe((res:any)=>{
              
              Swal.fire({
                icon:'success',
                title:'Producto eliminado correctamente',
                confirmButtonText:'Ok'            
              }).then((result)=>{
                  
                if (result) {
                  this.obtenerProducto();
                }
    
              });
    
            }, (err)=>{
              Swal.fire('Error', err.error.message, 'error')
            })
          );
        }      

    }); 

  }

  generatePdf() {
    let pdf = new jsPDF();

    let products:any = this.dataSource.data;
    let detTableData:any = [];
    let tableData:any [] = [];

    let eNomComercial:any = localStorage.getItem('eNomComercial');
    let user:any = localStorage.getItem('user');
    let logo = new Image();
    logo.src = '../../assets/dist/img/logo.png';
    let logoSystem = new Image();
    logoSystem.src = '../../assets/dist/img/newsystemok.png';

    products.forEach((element: { [x: string]: any; }) =>{
      detTableData.push(element['AR_CODKEY']);
      detTableData.push(element['AR_CODIGO']);
      detTableData.push(element['AR_DESCRIPCION']);
      detTableData.push(element['AR_PRECIODIS_DOLAR']);
      detTableData.push(element['AR_AFECSTOCK']);
      detTableData.push(element['AR_IVA']);
      detTableData.push(element['AR_ESTADO']);

      tableData.push(detTableData);
      detTableData = [];
    } );

    (pdf as any).autoTable({
    head: [['Codigo',  'Auxiliar', 'Descripcion', 'Precio', 'Tipo','Iva', 'Estado']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 8 },
    minCellWidth: 100,
    cellWidth: 100,
    tableWidth: 'wrap',
    columnStyles: { 
      0: { halign: 'left', cellWidth: 20 },
      1: { halign: 'left', cellWidth: 20 },
      2: { halign: 'left', cellWidth: 90 },
      3: { halign: 'right'}}, // Cells in first column centered and green
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
      pdf.text('Lista de Productos',  75, 14);
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
    pdf.save(`${new Date().toISOString()}_productos.pdf`);

  }
  
}
