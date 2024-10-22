import { DataGrid } from "@mui/x-data-grid"
import { Typography } from "@mui/material"
import { esES } from '@mui/x-data-grid/locales';
import './styles.css'

export default function CustomTable ({ columns, rows, isLoading }) {
    const noDataOverlay = () =>  (
        <div style={{ width: '100%', height: '100%', display:'flex', justifyContent:'center', alignItems:'center' }}>
            <Typography variant="h5" gutterBottom>
                No se encontraron datos
            </Typography>
        </div>
    )

return (
    <DataGrid
        columns={columns}
        rows={rows}
        loading={isLoading}
        autosizeOnMount={true}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        getRowId={row => row.$id}
        getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        slotProps={{
            loadingOverlay: {
              variant: 'skeleton',
              noRowsVariant: 'skeleton',
            },
        }}
        slots={{
            noRowsOverlay: noDataOverlay
        }}
    />
)}