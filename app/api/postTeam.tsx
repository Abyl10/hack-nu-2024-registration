import axios, { AxiosError } from "axios";

export default async function postTeam(team: any) {

  const entities: any[] = []
  
  const res = await axios.post(
    `http://195.93.152.115/api/register/`,
    { team
  },
  )
  
  
  return res;
}