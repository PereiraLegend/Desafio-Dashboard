import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Input } from '@chakra-ui/react';
import axios from 'axios';
import Link from 'next/link';

export default function Tabela() {
    const [dados, setDados] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [ordenacao, setOrdenacao] = useState({ coluna: null, ascendente: true });

    useEffect(() => {
        axios.get('http://localhost:5001/api/employees')
            .then(response => {
                setDados(response.data);
                setDadosFiltrados(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar dados da API:', error);
            });
    }, []);

    const btnAlterar = (id) => {
        console.log(`Alterar item com ID ${id}`);
    };

    const btnDeletar = (id) => {
        console.log("O id é :"+ id)
        axios.delete(`http://localhost:5001/api/employees/${id}`)
            .then(response => {
                setDadosFiltrados(prevData => prevData.filter(item => item.id !== id));
                console.log(`Item com ID ${id} deletado com sucesso!`);
            })
            .catch(error => {
                console.error(`Erro ao deletar item com ID ${id}:`, error);
            });
        window.location.reload()
    };
    

    const handleFiltroChange = (event) => {
        const valorFiltro = event.target.value;
        setFiltro(valorFiltro);
        const dadosFiltrados = dados.filter(item =>
            item.nome.toLowerCase().includes(valorFiltro.toLowerCase()) ||
            item.cargo.toLowerCase().includes(valorFiltro.toLowerCase()) ||
            item.departamento.toLowerCase().includes(valorFiltro.toLowerCase())
        );
        setDadosFiltrados(dadosFiltrados);
    };

    const handleOrdenacao = (coluna) => {
        setOrdenacao(prevState => ({
            coluna,
            ascendente: prevState.coluna === coluna ? !prevState.ascendente : true
        }));

        const ordenarPor = (a, b) => {
            if (a[coluna] < b[coluna]) {
                return -1;
            }
            if (a[coluna] > b[coluna]) {
                return 1;
            }
            return 0;
        };

        const dadosOrdenados = [...dadosFiltrados].sort((a, b) => {
            const multiplicador = ordenacao.ascendente ? 1 : -1;
            return multiplicador * ordenarPor(a, b);
        });

        setDadosFiltrados(dadosOrdenados);
    };

    return (
        <div>
            <div className='pl-5 pr-5 flex justify-between '>
                <Input
                    className='border-4 rounded-lg'
                    type="text"
                    placeholder="Buscar..."
                    value={filtro}
                    onChange={handleFiltroChange}
                    variant="filled"
                    size="md"
                    mb={4}
                />

                <Button colorScheme='teal' size='md' className='bg-green-200 hover:bg-green-300 p-1 rounded-lg'>
                    <Link href="/cadastro">
                        Cadastrar Funcionário
                    </Link>
                </Button>
            </div>

            <div className='flex w-[100%] justify-center items-center pl-5 pr-5'>
                <Table variant="simple" size="md" className='w-[100%] min-w-full divide-y divide-gray-200'>
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th onClick={() => handleOrdenacao('nome')} className="px-6 py-3 text-left text-6lg font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Nome</Th>
                            <Th onClick={() => handleOrdenacao('cargo')} className="px-6 py-3 text-left text-6lg font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Cargo</Th>
                            <Th onClick={() => handleOrdenacao('departamento')} className="px-6 py-3 text-left text-6lg font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Departamento</Th>
                            <Th className="px-6 py-3 text-left text-6lg font-medium text-gray-500 uppercase tracking-wider">Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {dadosFiltrados.length > 0 ? (
                            dadosFiltrados.map((item, index) => (
                                <Tr className='rounded-lg hover:bg-gray-200 hover:cursor-pointer' key={item.id}>
                                    <Td className='p-1'>{index + 1}</Td>
                                    <Td className="px-5 py-2 whitespace-nowrap">{item.nome}</Td>
                                    <Td className="px-5 py-2 whitespace-nowrap">{item.cargo}</Td>
                                    <Td className="px-5 py-2 whitespace-nowrap">{item.departamento}</Td>
                                    <Td className="px-5 py-2 whitespace-nowrap">
                                        <Button className="bg-blue-200 hover:bg-blue-300 p-1 rounded-lg mr-2" colorScheme="blue" onClick={() => btnAlterar(item.id)}>Alterar</Button>
                                        <Button className="bg-red-200 hover:bg-red-300 p-1 rounded-lg" colorScheme="red" onClick={() => btnDeletar(item._id)}>Deletar</Button>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan="5">Carregando...</Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </div>
        </div>
    );
}