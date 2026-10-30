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

// carrega os dados do produto selecionado para edição
editarProduto(produto: Produto): void {
  this.idProdutoEdicao = produto.iditem;

  this.novoProduto = {
    idcategoria: produto.idcategoria,
    item: produto.item,
    descricaoItem: produto.descricaoItem,
    preco: produto.preco,
    tipoItem: produto.tipoItem,
    ativoProdutoServico: produto.ativoProdutoServico
  };
}

  // salva as alterações do produto na API
salvarEdicaoProduto(): void {

  // verifica se existe um produto selecionado para edição
  if (this.idProdutoEdicao === null) {
    return;
  }

  // envia os dados atualizados para a API
  this.http.put<void>(
    `https://localhost:7161/api/Item/${this.idProdutoEdicao}`,
    this.novoProduto
  ).subscribe({

    // executa quando a atualização é realizada com sucesso
    next: () => {

      // localiza o produto que foi atualizado na lista
      const indice = this.produtos.findIndex(
        produto => produto.iditem === this.idProdutoEdicao
      );

      // atualiza os dados do produto na lista
      if (indice !== -1) {
        this.produtos[indice] = {
          ...this.novoProduto,
          iditem: this.idProdutoEdicao!
        };
      }

      // limpa o formulário
      this.novoProduto = {
        idcategoria: 1,
        item: '',
        descricaoItem: '',
        preco: 0,
        tipoItem: 'P',
        ativoProdutoServico: 'A'
      };

      // encerra o modo de edição
      this.idProdutoEdicao = null;

      // atualiza a tela
      this.cdr.detectChanges();

      alert('Produto atualizado com sucesso!');
    },

    // executa caso ocorra algum erro
    error: (erro) => {
      console.error('Erro ao atualizar produto:', erro);
      alert('Não foi possível atualizar o produto.');
    }
  });
}


  
  // método para desativar um produto sem excluir seu registro do banco
  desativarProduto(produto: Produto): void {

    // solicita confirmação antes de realizar a desativação
    const confirmar = confirm(
      `Deseja realmente desativar o produto ${produto.item}?`
    );

    // interrompe o método caso o usuário não confirme
    if (!confirmar) {
      return;
    }

    // prepara os dados do produto mantendo suas informações
    // e alterando somente o status para inativo
    const produtoAtualizado = {
      idcategoria: produto.idcategoria,
      item: produto.item,
      descricaoItem: produto.descricaoItem,
      preco: produto.preco,
      tipoItem: produto.tipoItem,
      ativoProdutoServico: 'I'
    };

    // envia a atualização do produto para a API
    this.http.put<void>(
      `https://localhost:7161/api/Item/${produto.iditem}`,
      produtoAtualizado
    ).subscribe({

      // executa estas ações quando a API confirma a atualização
      next: () => {

        // remove o produto da lista de produtos ativos exibida na tela
        this.produtos = this.produtos.filter(
          p => p.iditem !== produto.iditem
        );

        // atualiza a exibição da página
        this.cdr.detectChanges();

        // informa ao usuário que a operação foi concluída
        alert('Produto desativado com sucesso!');
      },

      // trata possíveis erros durante a atualização
      error: (erro) => {

        // exibe os detalhes do erro no console
        console.error('Erro ao desativar produto:', erro);

        // informa ao usuário que não foi possível concluir a operação
        alert('Não foi possível desativar o produto.');
      }
    });
  }



  // cadastra um novo produto na API
  cadastrarProduto(): void {

  // verifica se os campos obrigatórios foram preenchidos
  if (
    !this.novoProduto.item.trim() ||
    !this.novoProduto.descricaoItem.trim() ||
    this.novoProduto.preco <= 0
  ) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  // envia os dados do produto para a API
  this.http.post<Produto>(
    'https://localhost:7161/api/Item',
    this.novoProduto
  ).subscribe({
    // executa quando o cadastro é realizado com sucesso
    next: (dados) => {

      // adiciona o produto cadastrado à lista
      this.produtos.push(dados);

      // limpa os campos do formulário
      this.novoProduto = {
        idcategoria: 1,
        item: '',
        descricaoItem: '',
        preco: 0,
        tipoItem: 'P',
        ativoProdutoServico: 'A'
      };

      // atualiza a tela
      this.cdr.detectChanges();

      alert('Produto cadastrado com sucesso!');
    },

    // executa caso ocorra algum erro
    error: (erro) => {
      console.error('Erro ao cadastrar produto:', erro);
      alert('Não foi possível cadastrar o produto.');

      }
    });
  }
}