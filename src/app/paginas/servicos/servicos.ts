// importa recursos para trabalhar com diretivas, pipes e formatação de dados
import { CommonModule, registerLocaleData } from '@angular/common';

// importa os dados de localização do português
import localePt from '@angular/common/locales/pt';

// importa os recursos necessários do Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

// permite realizar requisições HTTP para a API
import { HttpClient } from '@angular/common/http';

// permite utilizar links de navegação no HTML
import { RouterLink } from '@angular/router';

// registra os dados do português do Brasil para formatar valores e moedas
registerLocaleData(localePt, 'pt-BR');

// define a estrutura dos dados de um item recebido da API
interface Item {
  iditem: number;                 // identificador do item
  idcategoria: number;             // identificador da categoria
  item: string;                    // nome do produto ou serviço
  descricaoItem: string;           // descrição do item
  preco: number;                   // preço do item
  tipoItem: string;                // identifica se é produto (P) ou serviço (S)
  ativoProdutoServico: string;     // identifica se o item está ativo (A)
}

// configura o componente da página de serviços
@Component({
  // disponibiliza os recursos utilizados pelo HTML
  imports: [CommonModule, RouterLink],

  // define o nome utilizado para chamar o componente
  selector: 'app-servicos',

  // indica o arquivo de estilos da página
  styleUrl: './servicos.css',

  // indica o arquivo HTML da página
  templateUrl: './servicos.html',
})

// declara a classe do componente e permite executar ações na inicialização
export class Servicos implements OnInit {

  // armazena os serviços recebidos da API
  servicos: Item[] = [];

  // indica se os serviços ainda estão sendo carregados
  carregando = true;

  // armazena uma mensagem caso ocorra algum erro na consulta
  erro = '';

  // construtor responsável por disponibilizar os recursos necessários
  constructor(
    private http: HttpClient,             // realiza a comunicação com a API
    private cdr: ChangeDetectorRef        // atualiza a exibição da página
  ) {}

  // executa a consulta assim que a página de serviços é aberta
  ngOnInit(): void {

    // realiza uma requisição GET para buscar os itens cadastrados
    this.http.get<Item[]>('https://localhost:7161/api/Item')
      .subscribe({

        // executa quando a API retorna os dados com sucesso
        next: (dados) => {

          // filtra somente os itens classificados como serviços e ativos
          this.servicos = dados.filter(
            item => item.tipoItem === 'S' &&
                    item.ativoProdutoServico === 'A'
          );

          // informa que o carregamento foi concluído
          this.carregando = false;

          // atualiza a exibição da página com os dados recebidos
          this.cdr.detectChanges();
        },

        // executa caso ocorra algum erro na comunicação com a API
        error: () => {

          // apresenta uma mensagem de erro na página
          this.erro = 'Não foi possível carregar os serviços.';

          // encerra o estado de carregamento
          this.carregando = false;

          // atualiza a exibição para mostrar a mensagem de erro
          this.cdr.detectChanges();
        }
      });
  }
}
