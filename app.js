const vm = new Vue({
    el: '#app',
    data: {
       produtos: [],
       produto: false,
       carrinho: [],
       carrinhoAtivo: false,
       mensagemAlerta: 'Item adicionado ao carrinho',
       alertaAtivo: false
    },
    filters: {
        numberPrice(valor){
            return valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
        }
    },
    computed: {
        carrinhoTotal(){
            return this.carrinho.reduce((total, produto) => total + produto.preco, 0)
        }
    },
    methods: {
        fetchProdutos(){
            fetch("./api/produtos.json").then(response => response.json()).then(json => {
                this.produtos = json;
            })
        },

        fetchProduto(id){
            fetch(`./api/produtos/${id}/dados.json`).then(response => response.json()).then(json => {
                this.produto = json;
            })
        },
        openModal(id){
            this.fetchProduto(id);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'

            });
        },
        closeModal({target, currentTarget}){
            if(target === currentTarget){
                this.produto = false;
            }
        },
        closeCarrinho({target, currentTarget}){
            if(target === currentTarget){
                this.carrinhoAtivo = false;
            }
        },
        onAdd(){
            this.produto.estoque--
            const {id, nome, preco} = this.produto
            this.carrinho.push({id, nome, preco})
            this.alert(`${nome} adicionado ao carrinho`)
        },
        onRemove(index){
            this.carrinho.splice(index, 1)
        },
        onChangeLocalStorage(){
            if(localStorage.carrinho){
                this.carrinho = JSON.parse(localStorage.carrinho)
            }
        },
        alert(mensagem){
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true;
            setTimeout(() => {
                this.alertaAtivo = false;
            }, 1500);
        },
        compararEstoque(){
            const items = this.carrinho.filter(({id})=> id === this.produto.id )
            this.produto.estoque -= items.length
        },
        router(){
            const hash = window.location.hash
            if(hash){
                this.fetchProduto(hash.replace('#', ''))
            }
        },

    },
    watch: {
        produto(){
            document.title = this.produto.nome || 'Techno'
            const hash = this.produto.id || ''
            history.pushState(null, null, `#${hash}`)
            if(this.produto){
            this.compararEstoque()
            }
        },
        carrinho(){
            localStorage.setItem('carrinho', JSON.stringify(this.carrinho))
        }
    },
    created(){
        this.fetchProdutos()
        this.router()
        this.onChangeLocalStorage()
    }
})