import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast, ChakraProvider, Table, Thead, Tbody, Tr, Th, Td, Flex, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react';
import { FaArrowDownAZ } from 'react-icons/fa6';
import { FaTrash } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { IoIosAdd } from "react-icons/io";
import { GiOfficeChair } from "react-icons/gi";
import { MdGroups } from "react-icons/md";
import axios from 'axios';
import Link from 'next/link';

export default function Tabela() {
    const [dados, setDados] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [ordenacao, setOrdenacao] = useState({ coluna: null, ascendente: true });
    const [isOpen, setIsOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const cancelRef = React.useRef();
    const toast = useToast();
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
    const [nome, setNome] = useState('');
    const [cargo, setCargo] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [selecionarEmpregado, setSelecionarEmpregado] = useState(null);
    const [atualPage, setAtualPage] = useState(1);

    useEffect(() => {
        axios.get('http://localhost:5001/api/employees')
            .then(response => {
                setDados(response.data);
                setDadosFiltrados(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar dados da API:', error);
                toast({
                    title: "Erro ao buscar dados da API.",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });
    }, [toast]);

    const btnAlterar = (empregado) => {
        setSelecionarEmpregado(empregado);
        setNome(empregado.nome);
        setCargo(empregado.cargo);
        setDepartamento(empregado.departamento);
        onEditModalOpen();
    };

    const btnDeletar = (id) => {
        axios.delete(`http://localhost:5001/api/employees/${id}`)
            .then(response => {
                setDadosFiltrados(prevData => prevData.filter(item => item._id !== id));
                toast({
                    title: `Item com ID ${id} deletado com sucesso!`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            })
            .catch(error => {
                console.error(`Erro ao deletar item com ID ${id}:`, error);
                toast({
                    title: `Erro ao deletar item com ID ${id}.`,
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });
        setIsOpen(false);
    };

    const btnDelete = (id) => {
        setItemToDelete(id);
        setIsOpen(true);
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

    const funcOrdenacao = (coluna) => {
        setOrdenacao(prevState => ({
            coluna,
            ascendente: prevState.coluna === coluna ? !prevState.ascendente : true
        }));

        const ordenarPor = (a, b) => {
            if (a[coluna] < b[coluna]) return -1;
            if (a[coluna] > b[coluna]) return 1;
            return 0;
        };

        const dadosOrdenados = [...dadosFiltrados].sort((a, b) => {
            const multiplicador = ordenacao.ascendente ? 1 : -1;
            return multiplicador * ordenarPor(a, b);
        });

        setDadosFiltrados(dadosOrdenados);
    };

    const EnviarFormulario = async (e) => {
        e.preventDefault();

        const empregadoData = {
            nome,
            cargo,
            departamento
        };

        try {
            const response = await fetch('http://localhost:5001/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empregadoData)
            });

            if (response.ok) {
                const result = await response.json();
                setDados([...dados, result]);
                setDadosFiltrados([...dados, result]);
                onModalClose();
                setNome('');
                setCargo('');
                setDepartamento('');
                toast({
                    title: 'Cadastro realizado com sucesso!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                window.location.reload()
            } else {
                toast({
                    title: 'Erro ao cadastrar.',
                    description: 'Por favor, tente novamente.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Erro:', error);
            toast({
                title: 'Erro ao cadastrar.',
                description: 'Por favor, tente novamente.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const EnviarFormularioAlterar = async (e) => {
        e.preventDefault();

        const empregadoData = {
            nome,
            cargo,
            departamento
        };

        try {
            const response = await fetch(`http://localhost:5001/api/employees/${selecionarEmpregado._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empregadoData)
            });

            if (response.ok) {
                const result = await response.json();
                setDados(dados.map(emp => (emp._id === result._id ? result : emp)));
                setDadosFiltrados(dadosFiltrados.map(emp => (emp._id === result._id ? result : emp)));
                onEditModalClose();
                setSelecionarEmpregado(null);
                setNome('');
                setCargo('');
                setDepartamento('');
                toast({
                    title: 'Dados atualizados com sucesso!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                window.location.reload()
            } else {
                toast({
                    title: 'Erro ao atualizar.',
                    description: 'Por favor, tente novamente.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Erro:', error);
            toast({
                title: 'Erro ao atualizar.',
                description: 'Por favor, tente novamente.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Dividir os dados em lotes de 10 itens
    const itemsPorPage = 10;
    const totalPages = Math.ceil(dadosFiltrados.length / itemsPorPage);

    // Função para obter os dados a serem exibidos na página atual
    const getPaginatedData = () => {
        const inicial = (atualPage - 1) * itemsPorPage;
        const final = inicial + itemsPorPage;
        return dadosFiltrados.slice(inicial, final);
    };

    // Função para avançar para a próxima página
    const proximaPage = () => {
        setAtualPage(anteriorPage => Math.min(anteriorPage + 1, totalPages));
    };

    // Função para voltar para a página anterior
    const anteriorPage = () => {
        setAtualPage(anteriorPage => Math.max(anteriorPage - 1, 1));
    };

    const numeroLinha = (index) => {
        return (atualPage - 1) * itemsPorPage + index + 1;
    };

    return (
        <ChakraProvider>
            <Box p={5}>
                <Flex justify="space-between" mb={4}>
                    <Flex>
                        <Input type="text" placeholder="Buscar..." className='border' value={filtro} onChange={handleFiltroChange} variant="filled" size="md" mr={2}/>
                        <IconButton icon={<FaArrowDownAZ />} colorScheme="teal" title="Ordenar por Nome" onClick={() => funcOrdenacao('nome')} mr={2}/>
                        <IconButton icon={<GiOfficeChair />} colorScheme="teal" title="Ordenar por Cargo" onClick={() => funcOrdenacao('cargo')} mr={2}/>
                        <IconButton icon={<MdGroups />} colorScheme="teal" title="Ordenar por Departamento" onClick={() => funcOrdenacao('departamento')}/>

                    </Flex>
                    <Button colorScheme="green" onClick={onModalOpen}><IoIosAdd/> Cadastrar Funcionário</Button>
                </Flex>
                <Box overflowX="auto">
                    <Table variant="simple" size="md">
                        <Thead>
                            <Tr>
                                <Th>#</Th>
                                <Th onClick={() => funcOrdenacao('nome')} cursor="pointer">Nome</Th>
                                <Th onClick={() => funcOrdenacao('cargo')} cursor="pointer">Cargo</Th>
                                <Th onClick={() => funcOrdenacao('departamento')} cursor="pointer">Departamento</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {getPaginatedData().map((item, index) => (
                                <Tr key={item._id} _hover={{ bg: "gray.100" }}>
                                    <Td>{numeroLinha(index)}</Td>
                                    <Td>{item.nome}</Td>
                                    <Td>{item.cargo}</Td>
                                    <Td>{item.departamento}</Td>
                                    <Td>
                                        <Button colorScheme="blue" size="sm" mr={2} title="Editar" onClick={() => btnAlterar(item)}><MdEditSquare /></Button>
                                        <Button colorScheme="red" size="sm" title="Deletar" onClick={() => btnDelete(item._id)}><FaTrash /></Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                {/* Botões de navegação para páginas */}
                <Flex justify="center" mt={4}>
                    <Button mr={2} onClick={anteriorPage} disabled={atualPage === 1}><TbPlayerTrackPrevFilled /></Button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <Button key={i + 1} mr={2} onClick={() => setAtualPage(i + 1)} colorScheme={atualPage === i + 1 ? "teal" : "gray"}>{i + 1}</Button>
                    ))}
                    <Button onClick={proximaPage} disabled={atualPage === totalPages}><TbPlayerTrackNextFilled /></Button>
                </Flex>

                <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={() => setIsOpen(false)}>
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">Deletar Funcionário</AlertDialogHeader>
                            <AlertDialogBody>Você tem certeza que deseja deletar este funcionário? Esta ação não pode ser desfeita.</AlertDialogBody>
                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={() => setIsOpen(false)}>Cancelar</Button>
                                <Button colorScheme="red" onClick={() => btnDeletar(itemToDelete)} ml={3}>Deletar</Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>

                <Modal isOpen={isModalOpen} onClose={onModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Cadastrar Funcionário</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <form onSubmit={EnviarFormulario}>
                                <FormControl id="nome" isRequired mb={4}>
                                    <FormLabel>Nome</FormLabel>
                                    <Input type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>
                                </FormControl>
                                <FormControl id="cargo" isRequired mb={4}>
                                    <FormLabel>Cargo</FormLabel>
                                    <Input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)}/>
                                </FormControl>
                                <FormControl id="departamento" isRequired mb={4}>
                                    <FormLabel>Departamento</FormLabel>
                                    <Input type="text" value={departamento} onChange={(e) => setDepartamento(e.target.value)}/>
                                </FormControl>
                                <Button type="submit" colorScheme="blue" width="full" mt={4}>Cadastrar</Button>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onModalClose} width="full">Fechar</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Alterar Funcionário</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <form onSubmit={EnviarFormularioAlterar}>
                                <FormControl id="nome" isRequired mb={4}>
                                    <FormLabel>Nome</FormLabel>
                                    <Input type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>
                                </FormControl>
                                <FormControl id="cargo" isRequired mb={4}>
                                    <FormLabel>Cargo</FormLabel>
                                    <Input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)}/>
                                </FormControl>
                                <FormControl id="departamento" isRequired mb={4}>
                                    <FormLabel>Departamento</FormLabel>
                                    <Input type="text" value={departamento} onChange={(e) => setDepartamento(e.target.value)}/>
                                </FormControl>
                                <Button type="submit" colorScheme="blue" width="full" mt={4}>Alterar</Button>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onEditModalClose} width="full">Fechar</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </ChakraProvider>
    );
}
