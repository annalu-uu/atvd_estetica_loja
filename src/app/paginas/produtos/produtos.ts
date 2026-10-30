// importa a função responsável por registrar os dados de localização no Angular
import { registerLocaleData } from '@angular/common';

// importa os dados de localização do idioma português
import localePt from '@angular/common/locales/pt';

import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

// registra os dados do português do Brasil para permitir a formatação correta de números e moedas
registerLocaleData(localePt, 'pt-BR');

// representa os dados de um item recebido da API
interface Item {
  iditem: number;
  idcategoria: number;
  item: string;
  descricaoItem: string;
  preco: number;
  tipoItem: string;
  ativoProdutoServico: string;
}

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-produtos',
  styleUrl: './produtos.css',
  templateUrl: './produtos.html',
})
export class Produtos implements OnInit {

  // guarda os produtos recebidos da API
  produtos: Item[] = [];

  // controla a mensagem de carregamento
  carregando = true;

  // guarda uma mensagem caso ocorra um erro
  erro = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // busca os produtos quando a página é aberta
  ngOnInit(): void {
    console.log('A página de produtos foi carregada!');
    this.http.get<Item[]>('https://localhost:7161/api/Item')
      .subscribe({
        next: (dados) => {
          // mantém apenas itens ativos que são produtos
          this.produtos = dados.filter(
            item => item.tipoItem === 'P' &&
                    item.ativoProdutoServico === 'A'
          );

          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.erro = 'Não foi possível carregar os produtos.';
          this.carregando = false;
          this.cdr.detectChanges();
        }
      });
  }
}
