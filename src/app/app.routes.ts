import { Routes } from '@angular/router';

// importa as páginas da aplicação
import { Inicio } from './paginas/inicio/inicio';
import { Produtos } from './paginas/produtos/produtos';
import { Servicos } from './paginas/servicos/servicos';
import { Clientes } from './paginas/clientes/clientes';
import { Carrinho } from './paginas/carrinho/carrinho';
import { Pedidos } from './paginas/pedidos/pedidos';
import { Administrativo } from './paginas/administrativo/administrativo';
import { ListaClientes } from './paginas/lista-clientes/lista-clientes';
import { AdminServicos } from './paginas/admin-servicos/admin-servicos';

// define as rotas da aplicação
export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'produtos', component: Produtos },
  { path: 'servicos', component: Servicos },
  { path: 'clientes', component: Clientes },
  { path: 'carrinho', component: Carrinho },
  { path: 'pedidos', component: Pedidos },
  { path: 'administrativo', component: Administrativo },
  { path: 'lista-clientes', component: ListaClientes },
  { path: 'admin-servicos', component: AdminServicos },

  // redireciona caminhos desconhecidos para a página inicial
  { path: '**', redirectTo: '' }
];
