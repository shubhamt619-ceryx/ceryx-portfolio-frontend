import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import KTWizard from '../../../../assets/js/components/wizard';
import { KTUtil } from '../../../../assets/js/components/util';

import { MessageService, TreeNode } from 'primeng-lts/api';
@Component({
  selector: 'app-add-sample',
  templateUrl: './add-sample.component.html',
  styleUrls: ['./add-sample.component.scss'],
  providers: [MessageService],
})
export class AddSampleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('wizard', { static: true }) el: ElementRef;
  model: any = {
    address1: 'Address Line 1',
    address2: 'Address Line 2',
    postcode: '3000',
    city: 'Melbourne',
    state: 'VIC',
    country: 'AU',
    package: 'Complete Workstation (Monitor, Computer, Keyboard & Mouse)',
    weight: '25',
    width: '110',
    height: '90',
    length: '150',
    delivery: 'overnight',
    packaging: 'regular',
    preferreddelivery: 'morning',
    locaddress1: 'Address Line 1',
    locaddress2: 'Address Line 2',
    locpostcode: '3072',
    loccity: 'Preston',
    locstate: 'VIC',
    loccountry: 'AU',
  };
  submitted = false;
  wizard: any;
  files: File[] = [];

  files1: TreeNode[] = [];

  selectedFile: TreeNode;

  selectedFiles1: TreeNode;

  selectedFiles2: TreeNode;
  nodeService: any;

  constructor(
    private messageService: MessageService) { }

  ngOnInit(): void {
    let filesData = [
      {
          "label": "Folder 1",
          "data": "Documents Folder",
          "expandedIcon": "pi pi-folder-open",
          "collapsedIcon": "pi pi-folder",
          "children": [{
                  "label": "Subfolder 1",
                  "data": "Work Folder",
                  "expandedIcon": "pi pi-folder-open",
                  "collapsedIcon": "pi pi-folder",
                  "children": [{"label": "Expenses.doc", "icon": "pi pi-file", "data": "Expenses Document"}, {"label": "Resume.doc", "icon": "pi pi-file", "data": "Resume Document"}]
              },
              {
                  "label": "Subfolder 2",
                  "data": "Home Folder",
                  "expandedIcon": "pi pi-folder-open",
                  "collapsedIcon": "pi pi-folder",
                  "children": [{"label": "Invoices.txt", "icon": "pi pi-file", "data": "Invoices for this month"}]
              }]
      },
      {
          "label": "Folder 2",
          "data": "Pictures Folder",
          "expandedIcon": "pi pi-folder-open",
          "collapsedIcon": "pi pi-folder",
          "children": [
              {"label": "barcelona.jpg", "icon": "pi pi-image", "data": "Barcelona Photo"},
              {"label": "logo.jpg", "icon": "pi pi-image", "data": "PrimeFaces Logo"},
              {"label": "primeui.png", "icon": "pi pi-image", "data": "PrimeUI Logo"}]
      },
      {
          "label": "Folder 3",
          "data": "Movies Folder",
          "expandedIcon": "pi pi-folder-open",
          "collapsedIcon": "pi pi-folder",
          "children": [{
                  "label": "Subfolder 1",
                  "data": "Pacino Movies",
                  "children": [{"label": "Scarface", "icon": "pi pi-video", "data": "Scarface Movie"}, {"label": "Serpico", "icon": "pi pi-video", "data": "Serpico Movie"}]
              },
              {
                  "label": "Subfolder 2",
                  "data": "De Niro Movies",
                  "children": [{"label": "Goodfellas", "icon": "pi pi-video", "data": "Goodfellas Movie"}, {"label": "Untouchables", "icon": "pi pi-video", "data": "Untouchables Movie"}]
              }]
      }
  ];
    this.files1 = filesData;

  }

  ngAfterViewInit() {
    // Initialize form wizard
    this.wizard = new KTWizard(this.el.nativeElement, {
      startStep: 1
    });

    // Validation before going to next page
    this.wizard.on('beforeNext', (wizardObj) => {
      // https://angular.io/guide/forms
      // https://angular.io/guide/form-validation

      // validate the form and use below function to stop the wizard's step
      // wizardObj.stop();
    });

    // Change event
    this.wizard.on('change', () => {
      setTimeout(() => {
        KTUtil.scrollTop();
      }, 500);
    });
  }

  onSubmit() {
    this.submitted = true;
  }

  ngOnDestroy() {
    this.wizard = undefined;
  }
  onSelect(event) {
    this.files.push(...event.addedFiles);
    if(this.files.length > 1){ // checking if files array has more than one content
    this.replaceFile(); // replace file
    }
    }
    
    //method for replacing file
    replaceFile(){
    this.files.splice(0,1); // index =0 , remove_count = 1
    }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  nodeSelect(event) {
    this.messageService.add({
      severity: 'info',
      summary: 'Node Selected',
      detail: event.node.label,
    });
  }

  nodeUnselect(event) {
    this.messageService.add({
      severity: 'info',
      summary: 'Node Unselected',
      detail: event.node.label,
    });
  }
}
