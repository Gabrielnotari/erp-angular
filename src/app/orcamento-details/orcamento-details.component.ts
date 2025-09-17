import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orcamento-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orcamento-details.component.html',
  styleUrl: './orcamento-details.component.css'
})
export class OrcamentoDetailsComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  orcamentoId:string | null = '';
  orcamento: any = null;
  status:string = '';
  message:string = ''

  ngOnInit(): void {
    
    this.route.params.subscribe(params =>{
      this.orcamentoId = params['orcamentoId'];
      this.getOrcamentoDetails();
    })
  }


  getOrcamentoDetails():void{
    if (this.orcamentoId) {
      this.apiService.getOrcamentoById(this.orcamentoId).subscribe({
        next:(orcamentoData: any) =>{
          if (orcamentoData.status === 200) {
            this.orcamento = orcamentoData.orcamento;
            this.status = this.orcamento.status;
          }
        },
        error:(error)=>{
          this.showMessage(
            error?.error?.message ||
              error?.message ||
              'Não foi possível obter orçamento por id ' + error
          );
        }
      })
    }
  }


  //Atualizar STATUS
  handleUpdateStatus():void{
    if (this.orcamentoId && this.status) {
      this.apiService.updateOrcamentoStatus(this.orcamentoId, this.status).subscribe({
        next:(result)=>{
          this.router.navigate(['/orcamento'])
        },
        error:(error)=>{
          this.showMessage(
            error?.error?.message ||
              error?.message ||
              'Não foi possível atualizar o orçamento ' + error
          );
        }
      })
    }
  }

    //SHOW ERROR
    showMessage(message: string) {
      this.message = message;
      setTimeout(() => {
        this.message = '';
      }, 4000);
    }


}
