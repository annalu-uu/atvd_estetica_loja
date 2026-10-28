import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  // endereço da API de pessoas
  private readonly apiUrl = 'https://localhost:7161/api/Pessoa';

  // dados preenchidos no formulário
  cliente = {
    nome: '',
    cpf: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    cep: '',
    numero: '',
    complemento: '',
  };

  // controla a mensagem e o envio do formulário
  mensagem = '';
  carregando = false;

  // recebe os recursos necessários para a comunicação
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // cadastra a pessoa e seu endereço
  cadastrarCliente(formulario: NgForm): void {
    if (formulario.invalid || this.carregando) {
      this.mensagem = 'Preencha corretamente os campos obrigatórios.';
      return;
    }

    // prepara os dados no formato esperado pela API
    const dados = {
      Nome: this.cliente.nome.trim(),
      Cpf: Number(this.cliente.cpf),
      DataNascimento: this.cliente.dataNascimento,
      Sexo: this.cliente.sexo,
      Email: this.cliente.email.trim(),
      Telefone: Number(this.cliente.telefone),
      AtivoPessoa: 'S',
      Enderecos: [
        {
          Cep: this.cliente.cep,
          Numero: this.cliente.numero.trim(),
          Complemento: this.cliente.complemento.trim(),
        },
      ],
    };

    this.carregando = true;
    this.mensagem = '';

    // envia o cadastro para o backend
    this.http.post(this.apiUrl, dados).subscribe({
      next: () => {
        this.mensagem = 'Cliente cadastrado com sucesso!';
        this.limparFormulario(formulario);
      },
      error: (erro) => {
        console.error('Erro ao cadastrar cliente:', erro);

        this.mensagem =
          erro.error?.title ||
          erro.error?.mensagem ||
          'Não foi possível cadastrar o cliente. Verifique a API e os dados informados.';
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  // limpa os campos do formulário
  limparFormulario(formulario: NgForm): void {
    formulario.resetForm();

    this.cliente = {
      nome: '',
      cpf: '',
      dataNascimento: '',
      sexo: '',
      email: '',
      telefone: '',
      cep: '',
      numero: '',
      complemento: '',
    };
  }

  // retorna à página inicial da loja
  voltarCatalogo(): void {
    this.router.navigateByUrl('/');
  }
}
