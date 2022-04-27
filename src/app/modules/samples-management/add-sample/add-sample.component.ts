import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import KTWizard from '../../../../assets/js/components/wizard';
import { KTUtil } from '../../../../assets/js/components/util';

import { MessageService, TreeNode } from 'primeng-lts/api';
import { CommonService } from 'src/app/_ceryx/services/common.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { isEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-add-sample',
  templateUrl: './add-sample.component.html',
  styleUrls: ['./add-sample.component.scss'],
  providers: [MessageService],
})

export class AddSampleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('wizard', { static: true }) el: ElementRef;
  submitted = false;
  wizard: any;
  files: File[] = [];
  files1: TreeNode[] = [];
  selectedFile: TreeNode;
  nodeService: any;
  uploadedFiles: any[] = []
  uploadedImageFiles: any[] = []
  currentCategory;
  subscriptions: Subscription[] = []
  sampleId = "";
  launchUrl = "";
  thumbnail = "";
  name = "";
  details = "";
  category:any = {
    "_id" : 0,
    "name": "-"
  };
  includeInDefaultPortfolio = false;
  excludeFromSamplesSelection = false;
  isSampleUploaded = false;
  isFinalStep = false;
  isEditMode = false;
  _sampleId = "";
  state:any;
  tags:any[] = [];
  baseUrl = environment.s3BaseUrl;
  categories: any[] = [];

  constructor(
    private messageService: MessageService,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.loadMode()
    this.loadCategories();
  }

  loadMode() {
    this.activatedRoute.data.subscribe(data => {
      if (Object.keys(data).length) {
          this.isEditMode = data.isEditMode
          this._sampleId = this.activatedRoute.snapshot.paramMap.get('id')
          console.log(this._sampleId, ' 222 ', this.isEditMode);
          this.loadSample(this._sampleId)
      }
    })
  }

  loadSample(sampleId) {
    let sampleSub = this.commonService.getRow('sample/' + sampleId).subscribe(res => {
      console.log(res);
      this.includeInDefaultPortfolio = res.include_in_default_portfolio;
      this.excludeFromSamplesSelection = res.in_staff_portfolio;
      this.uploadedFiles = res.uploadedFiles.filter(file => !file.includes(".jpg") && !file.includes(".png"));
      this.uploadedImageFiles = res.uploadedFiles.filter(file => file.includes(".jpg") || file.includes(".png"));
    });
    this.subscriptions.push(sampleSub)
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
      //console.log(this.wizard.getStep());
      if (this.wizard.getStep() == 4) {
        this.isFinalStep = true;
        this.cd.detectChanges();
        this.updateSampleInfo();
      } else if (this.wizard.getStep() == 1) {
        if (!this.isSampleUploaded) {
          this.uploadSampleFile();
        }
      }
      setTimeout(() => {
        KTUtil.scrollTop();
      }, 500);
    });
  }

  loadCategories() {
    let dSub = this.commonService.getRows('category/list').subscribe(res => {
       this.categories = res.items;
       this.cd.detectChanges()
     });
     this.subscriptions.push(dSub);
   }

  updateSampleInfo() {
    let sampleData = {
      "sampleId" : this.sampleId,
      "name" : this.name,
      "category" : this.category._id,
      "tags" : this.tags,
      "thumbnail" : this.thumbnail[0],
      "link" : this.launchUrl[0],
      "in_staff_portfolio": this.excludeFromSamplesSelection,
      "include_in_default_portfolio": this.includeInDefaultPortfolio,
    }
    let saveSub = this.commonService.fetchRow("sample/update", sampleData).subscribe(res => {
      this.messageService.clear()
      this.messageService.add({ severity: 'success', summary: 'Successfully', detail: 'Uploaded Sample', life: 3000 });
    })
    this.subscriptions.push(saveSub)
  }
  uploadSampleFile(){
    // fileName
    let random = Math.floor((Math.random() * 9999) + 1);
    if(this.files.length == 1){
      console.log(this.files);
      let fileDetails = { 
        "name": random,
        "link": 777,
        "tags": [],
        "category": random,
        "include_portfolio": [random],
        "in_staff_portfolio": this.excludeFromSamplesSelection,
        "createdBy": random,
        "fileName": this.files[0].name,
        "include_in_default_portfolio": this.includeInDefaultPortfolio,
       };
      let fileSub = this.commonService.fetchRow("sample/create", fileDetails).subscribe(res => {
        console.log(res, 'file res');
        this.sampleId = res._id;
        this.uploadSampleFilePutCall(res.upload_uri);
      });
      this.subscriptions.push(fileSub);
    }
  }


  uploadSampleFilePutCall(upload_uri) {
    let fileSub = this.commonService.putRow(upload_uri, this.files[0]).subscribe(res => {
        console.log(res, 'file res frin s3');
        this.saveSampleFile();
    });
    this.subscriptions.push(fileSub);
  }

  saveSampleFile() {
    let data = {
      "sampleId" : this.sampleId
    };
    let saveSub = this.commonService.patchRow("sample/upload", data).subscribe(res => {
      console.log(res, 'sample response');
      this.messageService.clear()
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'File uploaded successfully', life: 2000 });
      this.isSampleUploaded = true;
      this.getUploadedSampleDetails()
      //this.wizard.goNext()
    });
    this.subscriptions.push(saveSub);
  }

  getUploadedSampleDetails() {
    let getSub = this.commonService.getRow(`sample/${this.sampleId}`).subscribe(res => {
      console.log(res, 'sample response');
      this.uploadedFiles = res.uploadedFiles.filter(file => !file.includes(".jpg") && !file.includes(".png"));
      this.uploadedImageFiles = res.uploadedFiles.filter(file => file.includes(".jpg") || file.includes(".png"));
      this.cd.detectChanges();
    });
    this.subscriptions.push(getSub);
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
