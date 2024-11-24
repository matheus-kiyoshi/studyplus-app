import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { Button } from '@mui/material';

export default function CreateSubject() {
    // Estados para armazenar os dados do formulário
    const [subject, setSubject] = useState({
      name: '',
      description: '',
      timeSpent: undefined,
      color: '#fff', // Cor inicial
      userId: '', // Deve ser preenchido com o ID do usuário atual
    });
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setSubject((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleColorChange = (color: any) => {
      setSubject((prev) => ({
        ...prev,
        color: color.hex, // Atualize a cor escolhida no estado
      }));
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      console.log('Matéria criada:', subject);
  
      try {
        const response = await fetch('/api/subjects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subject),
        });
  
        if (response.ok) {
          console.log('Matéria criada com sucesso!');
        } else {
          console.error('Erro ao criar matéria.');
        }
      } catch (error) {
        console.error('Erro de rede:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="p-4">
        <label htmlFor="name" className="block mb-2 font-medium">
          Nome da Matéria
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={subject.name}
          onChange={handleChange}
          className="border rounded w-full p-2 mb-4"
          placeholder="Digite o nome da matéria"
        />
  
        <label htmlFor="description" className="block mb-2 font-medium">
          Descrição
        </label>
        <input
          id="description"
          name="description"
          type="text"
          value={subject.description}
          onChange={handleChange}
          className="border rounded w-full p-2 mb-4"
          placeholder="Digite a descrição"
        />
  
        <label htmlFor="color" className="block mb-2 font-medium">
          Cor
        </label>
        {/* Adiciona o Color Picker */}
        <div className="mb-4">
          <SketchPicker
            color={subject.color} // Cor atual do estado
            onChange={handleColorChange} // Atualiza a cor no estado
          />
        </div>
  
        <Button type="submit" variant="contained" className="bg-blue-500">
          Criar Matéria
        </Button>
      </form>
    );
  }