import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import KTWizard from '../../../../assets/js/components/wizard';
import { KTUtil } from '../../../../assets/js/components/util';

import { MessageService, TreeNode } from 'primeng-lts/api';
import { CommonService } from 'src/app/_ceryx/services/common.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-sample',
  templateUrl: './add-sample.component.html',
  styleUrls: ['./add-sample.component.scss'],
  providers: [MessageService],
})

export class AddSampleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('wizard', { static: true }) el: ElementRef;
  submitted = false;
  loading = false;
  isSampleUploading = false;
  isThumbnailUploading = false;
  wizard: any;
  files: File[] = [];
  thumbnailFiles: File[] = [];
  nodeService: any;
  uploadedAllFiles: any[] = [];
  uploadedFiles: any[] = [];
  uploadedImageFiles: any[] = [];
  currentCategory;
  subscriptions: Subscription[] = [];
  sampleId = '';
  launchUrl: any[] = [];
  thumbnail = '';
  name = '';
  details = '';
  category: any = {
    _id : 0,
    name: '-'
  };
  includeInDefaultPortfolio = false;
  excludeFromSamplesSelection = false;
  isSampleUploaded = false;
  isFinalStep = false;
  isEditMode = false;
  state: any;
  tags: any[] = [];
  flatArr = [];
  currentParentStr = '';
  baseUrl = environment.s3BaseUrl;
  categories: any[] = [];
  public addCategoryRef: (name) => void;

  constructor(
    private messageService: MessageService,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    ) {
    this.addCategoryRef = (name) => this.addCategory(name);
  }

  ngOnInit(): void {
    this.loadMode();
    this.loadCategories();
  }

  loadMode() {
    this.activatedRoute.data.subscribe(data => {
      if (Object.keys(data).length) {
          this.isEditMode = data.isEditMode;
          this.sampleId = this.activatedRoute.snapshot.paramMap.get('id');
          console.log(this.sampleId, ' 222 ', this.isEditMode);
          this.isSampleUploaded = true;
          this.loadSample(this.sampleId);
      }
    });
  }

  clearSelectedCategory() {
    this.category = {
      _id: 0,
      name: 'Please select category'
    };
  }

  addCategory(name) {
      console.log('Inside addCategory');
      this.loading = true;
      // Backend call.
      // resolve({ id: 5, name, valid: true });
      // this.loading = false;
      const createdBy = '62614f71c8c39e1c4b956bbf';
      if (name.includes('>')) {
        const data = { name , createdBy};
        const dSub = this.commonService.fetchRow('category/createhierarchy', data).subscribe(res => {
          console.log('Created');
          this.loading = false;
          this.loadCategories();
        });
        this.subscriptions.push(dSub);
      } else {
        const data = { name , createdBy};
        const dSub = this.commonService.fetchRow('category/create', data).subscribe(res => {
          console.log('Created');
          this.loading = false;
          this.loadCategories();
        });
        this.subscriptions.push(dSub);
      }
  }



  loadSample(sampleId) {
    const sampleSub = this.commonService.getRow('sample/' + sampleId).subscribe(res => {
      this.includeInDefaultPortfolio = res.include_in_default_portfolio;
      this.excludeFromSamplesSelection = res.in_staff_portfolio;
      this.uploadedAllFiles = res.uploadedFiles;
      this.uploadedFiles = [];
      const uploadedFilesRaw = res.uploadedFiles.filter(file => file.includes('.html'));
      uploadedFilesRaw.forEach(element => {
        this.uploadedFiles.push(element.replace(this.sampleId + '/', ''));
      });

      this.launchUrl = [res.launchUrl];
      this.name = res.name;
      this.details = res.details;
      this.tags = res.tags;
      this.sampleId = sampleId;
    });
    this.subscriptions.push(sampleSub);
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
    this.wizard.on('change', (wizardObj) => {
      // console.log(this.wizard.getStep());
      const finalStep = this.isEditMode ? 3 : 4;
      if (this.wizard.getStep() === finalStep) {
        this.isFinalStep = true;
        this.cd.detectChanges();
        this.updateSampleInfo();
      } else if (!this.isEditMode && this.wizard.getStep() === 1) {
        if (!this.isSampleUploaded) {
          wizardObj.stop();
          this.isSampleUploading = true;
          this.cd.detectChanges();
          this.uploadSampleFile();
        }
      } else if (!this.isEditMode && this.wizard.getStep() === 3) {
        wizardObj.stop();
        // Upload thumbnail sample creation
        this.uploadSampleThumbnail();
        this.messageService.clear();
      } else if (this.isEditMode && this.wizard.getStep() === 2) {
        // wizardObj.stop();
        // Upload thumbnail sample edit mode
        this.messageService.clear();
      } else if ((this.isEditMode && this.wizard.getStep() === 1) || (!this.isEditMode && this.wizard.getStep() === 2)) {
        // On thumbnail upload page
        wizardObj.stop();
        if (this.launchUrl.length) {
          this.messageService.clear();
          this.wizard.goNext();
        } else {
          this.messageService.clear();
          this.messageService.add({
            severity: 'warn',
            summary: 'Incomplete details',
            detail: 'Please select Launch url first.',
            life: 1000 });
        }
      }
      setTimeout(() => {
        KTUtil.scrollTop();
      }, 500);
    });
  }

  loadCategories() {

    this.categories = [];
    // this.categories.push({ _id: 0, name: 'Please select category'});
    const dSub = this.commonService.getRows('category/getCategoryList').subscribe(res => {
       this.flatArr = [];
      //  this.currentParentStr = '';
      //  console.log('Res items', res.items);
      //  this.processCategories(res.items);
      //  console.log('FlatArray is', this.flatArr);
       this.categories = res.items;
       this.cd.detectChanges();
     });
    this.subscriptions.push(dSub);
   }

  //  processCategories(allCat) {
  //    console.log('Got categories as ', allCat);
  //    if (Array.isArray(allCat)) {
  //      allCat.forEach((category) => {
  //        console.log('category', category, category.hasOwnProperty('children'));
  //        if (category.hasOwnProperty('children')) {

  //          for (let i = 0; i < category.children.length; i++) {
  //            this.currentParentStr += category.name + ' > ';
  //            this.processCategories(category.children[i], category);
  //          }
  //        } else {
  //          this.currentParentStr += '';
  //          this.processCategories(category, );
  //        }
  //      });
  //    } else {
  //      if (allCat.hasOwnProperty('children')) {
  //        for (let i = 0; i < allCat.children.length; i++) {
  //          this.currentParentStr += allCat.name + ' > ';
  //          this.processCategories(allCat.children[i], allCat);
  //        }
  //      } else {
  //        this.flatArr.push({
  //          _id: allCat._id,
  //          name: this.currentParentStr + allCat.name,
  //        });
  //        this.currentParentStr = '';
  //      }

  //    }

  //  }

  updateSampleInfo() {
    const sampleData = {
      sampleId : this.sampleId,
      name : this.name,
      category : this.category._id,
      tags : this.tags,
      thumbnail : this.thumbnail[0],
      details : this.details,
      link : this.launchUrl[0],
      in_staff_portfolio: this.excludeFromSamplesSelection,
      include_in_default_portfolio: this.includeInDefaultPortfolio,
    };
    const saveSub = this.commonService.fetchRow('sample/update', sampleData).subscribe(res => {
      this.messageService.clear();
      this.messageService.add({ severity: 'success', summary: 'Successfully', detail: 'Uploaded Sample', life: 3000 });
    });
    this.subscriptions.push(saveSub);
  }
  uploadSampleFile(){
    // fileName
    const random = Math.floor((Math.random() * 9999) + 1);
    if (this.files.length === 1){
      console.log(this.files);
      const fileDetails = {
        name: random,
        link: 777,
        tags: [],
        category: random,
        include_portfolio: [random],
        in_staff_portfolio: this.excludeFromSamplesSelection,
        createdBy: random,
        fileName: this.files[0].name,
        include_in_default_portfolio: this.includeInDefaultPortfolio,
       };
      const fileSub = this.commonService.fetchRow('sample/create', fileDetails).subscribe(res => {
        console.log(res, 'file res');
        this.sampleId = res._id;
        this.uploadSampleFilePutCall(res.upload_uri);
      });
      this.subscriptions.push(fileSub);
    }
  }

  uploadSampleThumbnail(){
    // fileName
    if (this.thumbnailFiles.length === 1){
      const thumbnailDetails = {
        sampleId: this.sampleId,
        thumbnail: this.sampleId + '/' + this.thumbnailFiles[0].name
      };
      const fileSub = this.commonService.fetchRow('sample/update', thumbnailDetails).subscribe(res => {
        this.uploadSampleThumbnailPutCall(res.thumbnail_uri);
      });
      this.subscriptions.push(fileSub);
    }
  }


  uploadSampleFilePutCall(uploadUrl) {
    const fileSub = this.commonService.putRow(uploadUrl, this.files[0]).subscribe(res => {
        console.log(res, 'file res from s3');
        this.saveSampleFile();
    });
    this.subscriptions.push(fileSub);
  }
  uploadSampleThumbnailPutCall(uploadUrl) {
    const fileSub = this.commonService.putRow(uploadUrl, this.thumbnailFiles[0]).subscribe(res => {
      this.saveSampleThumbnail();
    });
    this.subscriptions.push(fileSub);
  }

  saveSampleFile() {
    const data = {
      sampleId : this.sampleId,
    };
    const saveSub = this.commonService.patchRow('sample/upload', data).subscribe(res => {
      console.log(res, 'sample response');
      this.messageService.clear();
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'File uploaded successfully', life: 2000 });
      this.isSampleUploaded = true;
      this.getUploadedSampleDetails();
      // this.wizard.goNext()
    });
    this.subscriptions.push(saveSub);
  }

  saveSampleThumbnail() {
    const data = {
      sampleId : this.sampleId,
      thumbnail: this.sampleId + '/' + this.thumbnailFiles[0].name
    };
    const saveSub = this.commonService.patchRow('sample/thumbnail-upload', data).subscribe(res => {
      this.messageService.clear();
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Thumbnail uploaded successfully', life: 1000 });
      this.isThumbnailUploading = false;
      this.wizard.goNext();
    });
    this.subscriptions.push(saveSub);
  }

  getUploadedSampleDetails() {
    const getSub = this.commonService.getRow(`sample/${this.sampleId}`).subscribe(res => {
      this.isSampleUploading = false;
      this.uploadedFiles = [];
      this.uploadedAllFiles = res.uploadedFiles;
      const uploadedFilesRaw = res.uploadedFiles.filter(file => file.includes('.html'));
      uploadedFilesRaw.forEach(element => {
        this.uploadedFiles.push(element.replace(this.sampleId + '/', ''));
      });
      this.cd.detectChanges();
      this.wizard.goNext();
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
    if (this.files.length > 1){ // checking if files array has more than one content
    this.replaceFile(); // replace file
    }
    }

    // method for replacing file
    replaceFile(){
    this.files.splice(0, 1); // index =0 , remove_count = 1
    }


  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  onSelectThumbnail(event) {
    this.thumbnailFiles.push(...event.addedFiles);
    setTimeout(() => {
      console.log(this.thumbnailFiles);
      this.cd.detectChanges();
    }, 150);
    if (this.thumbnailFiles.length > 1){ // checking if files array has more than one content
      this.replaceThumbnailFile(); // replace file
    }
  }

  // method for replacing file
  replaceThumbnailFile(){
    this.thumbnailFiles.splice(0, 1); // index =0 , remove_count = 1
  }

  // Know when value is changed and what value we received

  onRemoveThumbnail(event) {
    console.log(event);
    this.thumbnailFiles.splice(this.thumbnailFiles.indexOf(event), 1);
  }
}
