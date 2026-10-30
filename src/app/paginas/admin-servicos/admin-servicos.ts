import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// representa os dados de um serviço recebido da API
interface Servico {
  iditem: number;
  idcategoria: number;
  item: string;
  descricaoItem: string;
  preco: number;
  tipoItem: string;
  ativoProdutoServico: string;
}

@Component({
  selector: 'app-admin-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './admin-servicos.css',
  templateUrl: './admin-servicos.html',
})
export class AdminServicos implements OnInit {

  // armazena os serviços cadastrados
  servicos: Servico[] = [];

  // armazena os dados digitados no formulário
  novoServico = {
    idcategoria: 2,
    item: '',
    descricaoItem: '',
    preco: 0,
    tipoItem: 'S',
    ativoProdutoServico: 'A'
  };

  // construtor responsável por disponibilizar os recursos necessários para o componente
  constructor(

    // permite realizar requisições HTTP para acessar a API
    private http: HttpClient,

    // permite atualizar a tela após receber os dados da API
    private cdr: ChangeDetectorRef
  ) {}

  // executa a consulta assim que a página é aberta
  ngOnInit(): void {

    // busca todos os itens cadastrados na API
    this.http.get<Servico[]>('https://localhost:7161/api/Item')
      .subscribe({

        // executa quando a consulta é realizada com sucesso
        next: (dados) => {

          // mantém somente os serviços que estão ativos
          this.servicos = dados.filter(
            servico => servico.tipoItem === 'S' &&
                       servico.ativoProdutoServico === 'A'
          );

          // atualiza a tela
          this.cdr.detectChanges();
        },

        // executa caso ocorra algum erro na consulta
        error: (erro) => {
          console.error('Erro ao consultar serviços:', erro);
        }
      });
  }

  // cadastra um novo serviço na API
  cadastrarServico(): void {

    // verifica se os campos obrigatórios foram preenchidos
    if (
      !this.novoServico.item.trim() ||
      !this.novoServico.descricaoItem.trim() ||
      this.novoServico.preco <= 0
    ) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    // envia os dados do novo serviço para o backend
    this.http.post<Servico>(
      'https://localhost:7161/api/Item',
      this.novoServico
    ).subscribe({

      // executa quando o cadastro é realizado com sucesso
      next: (dados) => {

        // adiciona o serviço cadastrado à lista
        this.servicos.push(dados);

        // limpa os campos do formulário
        this.novoServico = {
          idcategoria: 2,
          item: '',
          descricaoItem: '',
          preco: 0,
          tipoItem: 'S',
          ativoProdutoServico: 'A'
        };

        // atualiza a tela
        this.cdr.detectChanges();

        alert('Serviço cadastrado com sucesso!');
      },

      // executa caso ocorra algum erro no cadastro
      error: (erro) => {
        console.error('Erro ao cadastrar serviço:', erro);
        alert('Não foi possível cadastrar o serviço.');
      }
    });
  }
}
