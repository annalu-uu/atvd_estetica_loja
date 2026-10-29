import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface ItemAtendimento {
  idAtendimento: number;
  idItem: number;
  item: string;
  idFuncionario: number;
  nomeFuncionario: string;
  cargo: string;
  quantidade: number;
  valorUnitario: number;
}

interface Atendimento {
  idAtendimento: number;
  idPessoa: number;
  nomePessoa: string;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: ItemAtendimento[];
}

@Component({
  selector: 'app-atendimentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './atendimentos.html',
  styleUrl: './atendimentos.css',
})
export class Atendimentos implements OnInit {
  // endereço da API de atendimentos
  private readonly apiUrl =
    'https://localhost:7161/api/Atendimento';

  // armazena os atendimentos retornados pela API
  atendimentos: Atendimento[] = [];

  // controla as mensagens e o carregamento
  mensagem = '';
  carregando = false;

  // recebe o recurso para consultar a API
  constructor(private http: HttpClient) {}

  // consulta os atendimentos quando a página abre
  ngOnInit(): void {
    this.listarAtendimentos();
  }

  // busca os atendimentos cadastrados no backend
  listarAtendimentos(): void {
    this.carregando = true;
    this.mensagem = '';

    this.http.get<Atendimento[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.atendimentos = dados;
        this.carregando = false;

        if (dados.length === 0) {
          this.mensagem = 'Nenhum atendimento cadastrado.';
        }
      },
      error: (erro) => {
        console.error('Erro ao consultar atendimentos:', erro);

        this.mensagem =
          'Não foi possível carregar os atendimentos. Verifique se a API está funcionando.';

        this.carregando = false;
      },
    });
  }
}
