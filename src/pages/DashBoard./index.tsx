import React, { useState,FormEvent,useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import {Link} from 'react-router-dom';
import { Title, Form, Repositories, Error } from './styles';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';
// import Repository from '../Repository';



interface Repository{
    full_name:string;
    description:string
    owner:{
        login:string;
        avatar_url:string;

    }
}

const DashBoard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState("");
    const [repositories, setRepositories] = useState<Repository[]>(()=>{
        const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if(storageRepositories){
            return JSON.parse(storageRepositories)
        }else{
            return[]
        }
    });



    useEffect(()=>{
localStorage.setItem('@GithubExplorer:repositories',JSON.stringify(repositories))
},[repositories]);

async function  handleAddRepository (event: FormEvent<HTMLFormElement>):Promise<void> {
    event.preventDefault();
    if(!newRepo){
        setInputError('Insert the RepositoryAuthor!')
        return;
    }

    try{
        const response = await api.get(`repos/${newRepo}`);

        const repository = response.data;
        setRepositories([...repositories,repository]);
        setNewRepo('')
        setInputError('')
    }catch(err){
        setInputError("Error on Search of this Repository"!)
    }

}

return (
    <>
    <img src={logoImg} alt="GitHub Explore" />
    <Title>Explore Repository on GitHUb</Title>


    <Form hasError={!!inputError} onSubmit={handleAddRepository}>
    <input
    value={newRepo}
    onChange={(e) => setNewRepo(e.target.value)}
    placeholder="Digite o nome do repositorion:"
    />
    <button type="submit">Pesquisar</button>
    </Form>

    { inputError && <Error>{inputError}</Error> }

    <Repositories>
    {repositories.map(repository=>(
        <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
        <img src={repository.owner.avatar_url}
        alt={repository.owner.login}
        />

        <div>
        <strong>{repository.full_name}</strong>
        <p>
        {repository.description}
        </p>
        </div>
        <FiChevronRight size={20} />

        <FiChevronRight size={20} />
        </Link>
        ))}

        </Repositories>
        </>
        );
    };

    export default DashBoard;
