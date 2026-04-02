import type { Transaction } from './../types.js';
import  {Router} from 'express'
import type { Request, Response} from 'express'
import {transactions} from "../mockData.js"
import {v4 as uuid} from 'uuid';

const router = Router()

let data: Transaction[] = [...transactions]

router.get('/', (req: Request, res:Response) => {
  let result = [...data]

  const {type, category, month, search, status} = req.query;

  if(type && type !== 'all'){
    result = result.filter(t => t.type === type)
  }

  if(category && category != 'all'){
    result = result.filter(t => t.category === category)
  }

  if(status && status !== 'all'){
    result = result.filter(t=>t.status === status)
  }

  if(month){
    result = result.filter(t=>t.date.startsWith(month as string))
  }

  if(search){
    const q = (search as string).toLowerCase()
    result = result.filter(
      t=> t.description.toLocaleLowerCase(q) || t.category.toLocaleLowerCase().includes(q) || t.note.toLowerCase().includes(q)
    )
  }
  res.json(result)

})

router.get('/:id',(req:Request, res:Response) => {
  const found = data.find(t => t.id === req.params.id)
  if(!found){
    res.status(404).json({message:'Transaction not found'})
    return
  }
  res.json(found)
})

router.post('/',(req:Request,res:Response)=>{
  const body = req.body as Omit<Transaction,'id'>

  if(!body.description || !body.amount || !body.type || !body.category){
    res.status(404).json({message:"Missing required fields"})
    return
  }

  const newTransaction: Transaction = {
    id : `TXN-${uuid().slice(0,6).toUpperCase()}`,
    ...body
  }

  data.unshift(newTransaction)
  res.status(201).json(newTransaction)
})

router.patch('/:id', (req:Request, res:Response)=>{
  const index = data.findIndex(t=> t.id === req.params.id)

  if(index === -1){
    res.status(404).json({message:"Transaction not found"})
    return
  }

  data[index] = {...data[index],...req.body}
  res.json(data[index])
})

router.delete('/:id', (req:Request, res:Response)=>{
  const index = data.findIndex( t=> t.id === req.params.id);

  if(index === -1){
    res.status(404).json({message:"Transaction not found"})
    return
  }

  const deleted = data.splice(index, 1)
  res.json(deleted[0])
})

export default router