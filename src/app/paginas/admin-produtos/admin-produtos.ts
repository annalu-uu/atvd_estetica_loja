import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// representa os dados de um produto recebido da API
interface Produto {
  iditem: number;
  idcategoria: number;
  item: string;
  descricaoItem: string;
  preco: number;
  tipoItem: string;
  ativoProdutoServico: string;
}

@Component({
  selector: 'app-admin-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-produtos.html',
  styleUrl: './admin-produtos.css',
})
export class AdminProdutos implements OnInit {

  // armazena os produtos cadastrados
  produtos: Produto[] = [];

  // armazena os dados digitados no formulário
  novoProduto = {
    idcategoria: 1,
    item: '',
    descricaoItem: '',
    preco: 0,
    tipoItem: 'P',
    ativoProdutoServico: 'A'
  };

  // guarda o identificador do produto que está sendo editado
  idProdutoEdicao: number | null = null;

  // disponibiliza os recursos necessários para o componente
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // executa a consulta assim que a página é aberta
  ngOnInit(): void {
    this.carregarProdutos();
  }

  // consulta os produtos cadastrados na API
  carregarProdutos(): void {
    this.http.get<Produto[]>('https://localhost:7161/api/Item')
      .subscribe({
        next: (dados) => {
          // mantém somente os produtos ativos
          this.produtos = dados.filter(
            produto => produto.tipoItem === 'P' &&
                       produto.ativoProdutoServico === 'A'
          );

          this.cdr.detectChanges();
        },
        error: (erro) => {
          console.error('Erro ao consultar produtos:', erro);
        }
      });
  }
}