import React,{useEffect,useState} from 'react';
import {useRouteMatch, Link} from 'react-router-dom'

import {Header,  Repositoryinfo,Issues} from './styles'
import {FcUpLeft} from 'react-icons/fc'
import logoImg from '../../assets/logo.svg'

import api from '../../services/api'

interface RepositoryParams{
    repository:string;
}


//  Tipagem de Variaveis que vão receber os dados//
interface Repository{
    full_name:string;
    description:string;
    stargazer_count:number;
    forks_count:number;
    open_issues_count:number;
    owner:{
        login:string;
        avatar_url:string;
    }



}

interface Issues{

    id:number;
    title:string;
    html_url:string;
    user:{
        login:string;
    }

}



const Repository: React.FC = () => {

    const [repository,setRepository] =  useState<Repository| null>(null);
    const [issues, setIssues] = useState<Issues[]>([])

    const {params} = useRouteMatch<RepositoryParams>();

    //DIspara uma ação quando chamado
    useEffect(()=>{
        api.get(`repos/${params.repository}`).then
        (
            (response)=>{
            setRepository(response.data);
        });

        api.get(`repos/${params.repository}/issues`).then
        (
            (response)=>{
            setIssues(response.data)
        })
    },[params.repository])

    return (
        <>
        <Header>
        <img src={logoImg} alt="Github Explore"/>
        <Link to="/">
        <FcUpLeft size ={16}/>
        Back
        </Link>
        </Header>


        {repository && (

        <Repositoryinfo>
        <header>
        <img
        src={repository.owner.avatar_url}
        alt={repository.owner.login}/>

        <div>
        <strong>{repository.full_name}</strong>
        <p>{repository.description}</p>
        </div>

        </header>

        <ul>
            <li>
            <strong>{repository.stargazer_count}</strong>
            <span>Stars</span>
            </li>
        <li>
        <strong>{repository.forks_count}</strong>
            <span>Forks</span>
            </li>
        <li>
            <strong>{ repository.open_issues_count  }</strong>
            <span>Issues Abertas</span>
            </li>
        </ul>
        </Repositoryinfo>

        )}


        <Issues>

       {issues.map((issue)=>(
            <a key={issue.id} href={issue.html_url}>
           <div>
             <strong>{issue.title}</strong>
           <p>{issue.user.login}
           </p>
           </div>

           <FcUpLeft size={20} />
           </a>
        ))}

       </Issues>
        </>
        );


    };

    export default Repository;
