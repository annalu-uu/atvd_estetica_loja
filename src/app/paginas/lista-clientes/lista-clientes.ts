import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

// representa o endereço retornado pela API
interface Endereco {
  idendereco: number;
  cep: string;
  numero: string;
  complemento: string;
}

// representa o cliente retornado pela API
interface Cliente {
  idpessoa: number;
  nome: string;
  cpf: number;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: number;
  ativoPessoa: string;
  enderecos: Endereco[];
}

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-clientes.html',
  styleUrl: './lista-clientes.css',
})
export class ListaClientes implements OnInit {
  // endereço da API de pessoas
  private readonly apiUrl = 'https://localhost:7161/api/Pessoa';

  // armazena os clientes retornados pela API
  clientes: Cliente[] = [];

  // controla mensagens e carregamento
  mensagem = '';
  carregando = false;

  // recebe o recurso necessário para consultar a API
  constructor(private http: HttpClient) {}

  // consulta os clientes quando a página é aberta
  ngOnInit(): void {
    this.listarClientes();
  }

  // busca a lista de clientes no backend
  listarClientes(): void {
    this.carregando = true;
    this.mensagem = '';

    this.http.get<Cliente[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.clientes = dados;
        this.carregando = false;

        if (dados.length === 0) {
          this.mensagem = 'Nenhum cliente cadastrado.';
        }
      },
      error: (erro) => {
        console.error('Erro ao consultar clientes:', erro);
        this.mensagem =
          'Não foi possível carregar os clientes. Verifique se o backend está rodando.';
        this.carregando = false;
      },
    });
  }
}
