
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

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

// configura o componente de listagem de clientes
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

  // armazena os clientes recebidos da API
  clientes: Cliente[] = [];

  // controla as mensagens exibidas na página
  mensagem = '';

  // indica se a consulta está em andamento
  carregando = false;

  // recebe os recursos necessários para consultar a API
  constructor(
    private http: HttpClient,
    private detector: ChangeDetectorRef
  ) {}

  // executa a consulta quando a página é aberta
  ngOnInit(): void {
    this.listarClientes();
  }

  // busca os clientes cadastrados no backend
  listarClientes(): void {
    this.carregando = true;
    this.mensagem = '';

    // envia uma requisição GET para a API
    this.http.get<Cliente[]>(this.apiUrl).subscribe({
      // executa quando a consulta é bem-sucedida
      next: (dados) => {
        // guarda os clientes recebidos
        this.clientes = dados;

        // encerra o carregamento
        this.carregando = false;

        // solicita a atualização da visualização
        this.detector.detectChanges();

        // informa quando não existem clientes
        if (dados.length === 0) {
          this.mensagem = 'Nenhum cliente cadastrado.';
        }
      },

      // executa quando ocorre um erro na consulta
      error: (erro) => {
        // registra os detalhes do erro no console
        console.error('Erro ao consultar clientes:', erro);

        // informa o problema ao usuário
        this.mensagem =
          'Não foi possível carregar os clientes. Verifique se o backend está rodando.';

        // encerra o carregamento
        this.carregando = false;

        // solicita a atualização da visualização
        this.detector.detectChanges();
      },
    });
  }
}
