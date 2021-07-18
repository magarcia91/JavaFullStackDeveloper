import { Signos } from 'src/app/_model/signos';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SignosService } from 'src/app/_service/signos.service';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css'],
})
export class SignosComponent implements OnInit {
  cantidad: number = 0;
  dataSource: MatTableDataSource<Signos>;
  displayedColumns = [
    'idSignos',
    'paciente',
    'fecha',
    'temperatura',
    'pulso',
    'ritmoRespiratorio',
    'acciones',
  ];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private signosService: SignosService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.signosService.signosCambio.subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signosService.mensajeCambio.subscribe((data) => {
      this.snack.open(data, 'AVISO', {
        duration: 2000,
      });
    });

    this.signosService.listarPageable(0, 10).subscribe((data) => {
      //console.log(data);
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      //this.dataSource.paginator = this.paginator;
    });
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idSignos: number) {
    this.signosService.eliminar(idSignos).subscribe(() => {
      this.signosService.listar().subscribe((data) => {
        this.signosService.signosCambio.next(data);
        this.signosService.mensajeCambio.next('SE ELIMINO');
      });
    });
  }

  mostrarMas(e: any) {
    this.signosService
      .listarPageable(e.pageIndex, e.pageSize)
      .subscribe((data) => {
        console.log(data);
        this.cantidad = data.totalElements;
        this.dataSource = new MatTableDataSource(data.content);
        this.dataSource.sort = this.sort;
        //this.dataSource.paginator = this.paginator;
      });
  }
}
