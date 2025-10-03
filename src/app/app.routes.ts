import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { GuardService } from './service/guard.service';
import { AddEditFornecedorComponent } from './add-edit-fornecedor/add-edit-fornecedor.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { AddEditProdutoComponent } from './add-edit-produto/add-edit-produto.component';
import { ProdutoComponent } from './produto/produto.component';
import { VendaComponent } from './venda/venda.component';
import { CompraComponent } from './compra/compra.component';
import { OrcamentoComponent } from './orcamento/orcamento.component';
import { OrcamentoDetailsComponent } from './orcamento-details/orcamento-details.component';
import { PerfilComponent } from './perfil/perfil.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImagemComponent } from './imagem/imagem.component';
import { AddEditProjetoComponent } from './add-edit-projeto/add-edit-projeto.component';
import { ProjetoComponent } from './projeto/projeto.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'categorias', component: CategoriaComponent, canActivate:[GuardService], data: {requiresAdmin: true} },

  { path: 'fornecedores', component: FornecedorComponent, canActivate:[GuardService], data: {requiresAdmin: true} },
  { path: 'edit-fornecedor/:fornecedorId', component: AddEditFornecedorComponent, canActivate:[GuardService], data: {requiresAdmin: true} },
  { path: 'add-fornecedor', component: AddEditFornecedorComponent, canActivate:[GuardService], data: {requiresAdmin: true} },

  { path: 'projetos', component: ProjetoComponent, canActivate:[GuardService], data: {requiresAdmin: true} },
  { path: 'edit-projeto/:projetoId', component: AddEditProjetoComponent, canActivate:[GuardService], data: {requiresAdmin: true} },
  { path: 'add-projeto', component: AddEditProjetoComponent, canActivate:[GuardService], data: {requiresAdmin: true} },

  { path: 'produtos', component: ProdutoComponent, canActivate:[GuardService], data: {requiresAdmin: true} },
  { path: 'edit-produto/:produtoId', component: AddEditProdutoComponent, canActivate:[GuardService], data: {requiresAdmin: true} },
  { path: 'add-produto', component: AddEditProdutoComponent, canActivate:[GuardService], data: {requiresAdmin: true} },

  { path: 'imagem', component: ImagemComponent, canActivate:[GuardService] },
  { path: 'compra', component: CompraComponent, canActivate:[GuardService] },
  { path: 'venda', component: VendaComponent, canActivate:[GuardService] },

  { path: 'orcamentos', component: OrcamentoComponent, canActivate:[GuardService] },
  { path: 'orcamento/:orcamentoId', component: OrcamentoDetailsComponent, canActivate:[GuardService] },


  { path: 'perfil', component: PerfilComponent, canActivate:[GuardService] },
  { path: 'dashboard', component: DashboardComponent, canActivate:[GuardService] },

//   WIDE CARD
    {path: "", redirectTo: "/login", pathMatch: 'full'},
    //{path: "**", redirectTo: "/dashboard"}


];
