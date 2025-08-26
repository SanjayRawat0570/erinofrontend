import React, { useState, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import api from '../services/api';
import LeadForm from './LeadForm.jsx';

const LeadsGrid = () => {
  const gridRef = useRef();
  const [columnDefs] = useState([
    { field: 'first_name', filter: 'agTextColumnFilter', floatingFilter: true, flex: 1 },
    { field: 'last_name', flex: 1 },
    { field: 'email', filter: 'agTextColumnFilter', floatingFilter: true, flex: 2 },
    { field: 'company', filter: 'agTextColumnFilter', floatingFilter: true, flex: 1 },
    { field: 'status', filter: 'agTextColumnFilter', floatingFilter: true, flex: 1 },
    { field: 'score', filter: 'agNumberColumnFilter', floatingFilter: true, flex: 1 },
    { field: 'createdAt', headerName: 'Created On', valueFormatter: params => new Date(params.value).toLocaleDateString(), flex: 1 },
    {
      field: 'actions',
      cellRenderer: (params) => {
        if (!params.data) {
          return null;
        }
        return (
          <div className="flex items-center h-full">
            <button onClick={() => handleEdit(params.data)} className="text-blue-600 hover:text-blue-800 font-semibold mr-3 transition">Edit</button>
            <button onClick={() => handleDelete(params.data.id)} className="text-red-600 hover:text-red-800 font-semibold transition">Delete</button>
          </div>
        );
      },
      filter: false,
      sortable: false,
      flex: 1
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const refreshGrid = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.refreshInfiniteCache();
    }
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        refreshGrid();
      } catch (error) {
        console.error("Failed to delete lead", error);
        alert("Error: Could not delete lead.");
      }
    }
  };

  const datasource = {
    getRows: async (params) => {
      try {
        const page = params.endRow / (params.endRow - params.startRow);
        const limit = params.endRow - params.startRow;
        
        let apiParams = { page, limit };
        
        Object.keys(params.filterModel).forEach(key => {
            const filter = params.filterModel[key];
            if (filter.type === 'contains') {
                apiParams[`${key}_contains`] = filter.filter;
            }
        });

        const response = await api.get('/leads', { params: apiParams });
        
        const lastRow = response.data.total <= params.endRow ? response.data.total : -1;
        params.successCallback(response.data.data, lastRow);
      } catch (error) {
        params.failCallback();
      }
    },
  };

  const onGridReady = useCallback((params) => {
    params.api.setGridOption('datasource', datasource);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">All Leads</h2>
        <button onClick={handleCreate} className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 font-semibold transition-transform transform hover:scale-105">
          Create New Lead
        </button>
      </div>
      <div className="ag-theme-alpine" style={{ height: '70vh', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowModelType="infinite"
          pagination={true}
          paginationPageSize={20}
          cacheBlockSize={20}
          onGridReady={onGridReady}
          defaultColDef={{
            sortable: true,
            resizable: true,
          }}
        />
      </div>
      {isModalOpen && (
        <LeadForm
          lead={selectedLead}
          onClose={() => setIsModalOpen(false)}
          onSave={refreshGrid}
        />
      )}
    </div>
  );
};
export default LeadsGrid;




