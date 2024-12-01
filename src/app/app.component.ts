import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isBrowser: boolean = false;
  gridApi: any;
  searchQuery: string = '';
  isSubmitEnabled: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }
  }

  columnDefs: ColDef[] = [
    { headerName: 'Tag Name', field: 'tagname', editable: true },
    { headerName: 'Description', field: 'description', editable: true },
    // {
    //   headerName: '',
    //   field: 'edit',
    //   cellRenderer: 'editButtonRenderer',
    //   cellRendererParams: {
    //     onEditClick: (rowIndex: number) => this.onEditClick(rowIndex),
    //   },
    // },
  ];

  // Row data for the AG Grid
  rowData = [
    { tagname: 'OPCO1', description: '' },
    { tagname: 'OPCO2', description: '' },
    { tagname: 'OPCO3', description: '' },
    { tagname: 'OPCO4', description: '' },
    { tagname: 'OPCO5', description: '' },
    { tagname: 'OPCO6', description: '' },
  ];
  gridOptions = {
    onGridReady: (params: any) => {
      this.gridApi = params.api;
    },
  };
  onSubmit() {
    // Here, we can check for the validity of the row data and submit it
    console.log('Submitting data:', this.rowData);
  }
  isRowDataValid(): boolean {
    let isValid = true;

    // Loop through each row and check if it's empty
    this.gridApi.forEachNode((node: any) => {
      const row = node.data;
      if (row.make === '' || row.model === '' || row.price === null) {
        isValid = false;
      }
    });

    return isValid;
  }
  onSearchQueryChanged() {
    this.gridApi.setQuickFilter(this.searchQuery); // Apply the quick filter to the grid
  }
  onCellValueChanged() {
    // When the value changes, check if the row data is valid
    this.isSubmitEnabled = this.isRowDataValid();
  }
  onEditClick(rowIndex: number) {
    // Start editing a specific row when the "Edit" button is clicked
    this.gridApi.startEditingCell({
      rowIndex: rowIndex,
      colKey: 'make', // You can dynamically change this to any column you want to start editing
    });
  }
  addRow() {
    alert('hi');
    const newRow = {
      make: '',
      model: '',
      price: null,
    };

    // Add the new row to the grid
    this.gridApi.applyTransaction({ add: [newRow] });

    // Enable the submit button once a new row is added
    this.isSubmitEnabled = true;
    const lastRowIndex = this.gridApi.getDisplayedRowCount() - 1;
    this.gridApi.startEditingCell({
      rowIndex: lastRowIndex,
      colKey: 'make', // You can change this to any column you want to start editing in
    });
  }
}
