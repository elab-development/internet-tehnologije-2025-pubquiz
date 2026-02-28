"use client";

import { Edit2, Trash2 } from "lucide-react";

interface Column {
  header: string;
  key: string;
  render?: (item: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: any) => void;
  isActionDisabled?: (item: any) => boolean;
}

export default function AdminTable({ columns, data, onEdit, onDelete, isActionDisabled }: AdminTableProps) {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/20">
      <table className="w-full text-left">
        <thead className="bg-neutral-900/50 text-xs border-b border-neutral-800 uppercase text-neutral-500 tracking-widest">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="p-4">{col.header}</th>
            ))}
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {data.length > 0 ? (
            data.map((item) => {
              const disabled = isActionDisabled ? isActionDisabled(item) : false;
              
              return (
                <tr key={item.id} className={`transition-colors ${disabled ? 'opacity-50' : 'hover:bg-neutral-900/40'}`}>
                  {columns.map((col, index) => (
                    <td key={index} className="p-4">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  <td className="p-4 flex justify-end gap-3">
                    <button 
                      onClick={() => !disabled && onEdit(item)} 
                      className={`${disabled ? 'text-neutral-600 cursor-not-allowed' : 'text-blue-400 hover:text-blue-200'} transition-colors`}
                      title={disabled ? "Finished" : "Edit"}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => !disabled && onDelete(item.id)} 
                      className={`${disabled ? 'text-neutral-600 cursor-not-allowed' : 'text-red-500 hover:text-red-300'} transition-colors`}
                      title={disabled ? "Finished" : "Delete"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="p-8 text-center text-neutral-500 text-sm">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}