import { Component, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
/*Pintura*/
import { AngularPinturaModule } from '@pqina/angular-pintura';
import { getEditorDefaults, createDefaultImageWriter } from '@pqina/pintura';
/*SyncFusion*/
import {
  ImageEditor,
  ImageEditorModule,
} from '@syncfusion/ej2-angular-image-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatTabsModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    AngularPinturaModule,
    ImageEditorModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'poc-gcert';

  recipientName: string = 'Diego';
  emissionDate: string = '2024-11-23';
  certificationTitle: string = 'Azure Fundamentals';
  extractedTemplate: string = '';
  toInsertTemplate: string = '';

  public insertValues(): void {
    if (this.tabIndex == 0) {
      this.pinturaInsertValues();
    } else {
      this.syncfusionInsertValues();
    }
  }

  public extractTemplates(): void {
    if (this.tabIndex == 0) {
      this.pinturaExtractTemplates();
    } else {
      this.syncfusionExtractTemplates();
    }
  }

  public insertTemplates(): void {
    if (this.tabIndex == 0) {
      this.pinturaInsertTemplates();
    } else {
      this.syncfusionInsertTemplates();
    }
  }

  public exportCertificate(): void {
    if (this.tabIndex == 0) {
      this.pinturaExportCertificate();
    } else {
      this.syncfusionExportCertificate();
    }
  }

  /* Pqina Pintura */
  @ViewChild('editor') editor?: any;
  public tabIndex: number = 0;

  public src: string = 'assets/sample-certificate.jpg';
  public editorDefaults: any = getEditorDefaults();

  imageAnnotation: any[] = [];

  private pinturaExportCertificate(): void {
    const imageWriter = createDefaultImageWriter({
      canvasMemoryLimit: 4096 * 4096,
      orientImage: true,
      copyImageHead: false,
      mimeType: 'image/png',
      quality: 0.9,
      targetSize: {
        width: 640,
        height: 480,
        fit: 'contain',
        upscale: false,
      },
      outputProps: [],
    });

    this.editor.editor
      .processImage({ imageWriter })
      .then((imageWriterResult: any) => {
        const blob = new Blob([imageWriterResult.dest], { type: 'image/png' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'certificate.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      });
  }

  private pinturaInsertValues(): void {
    this.imageAnnotation.push({
      id: 'recipientName',
      x: 0,
      y: 0,
      text: this.recipientName,
      fontSize: 64,
    });
    this.imageAnnotation.push({
      id: 'emissionDate',
      x: 0,
      y: 100,
      text: this.emissionDate,
      fontSize: 64,
    });
    this.imageAnnotation.push({
      id: 'certificationTitle',
      x: 0,
      y: 200,
      text: this.certificationTitle,
      fontSize: 64,
    });

    this.editor.editor.imageAnnotation = this.imageAnnotation;
  }

  private pinturaExtractTemplates(): void {
    this.extractedTemplate = JSON.stringify(this.editor.editor.imageAnnotation);
    console.log(this.extractedTemplate);
  }

  private pinturaInsertTemplates(): void {
    this.editor.editor.imageAnnotation = JSON.parse(this.toInsertTemplate);
  }

  /* SyncFusion ImageEditor */
  @ViewChild('sfEditor') imageEditor?: ImageEditor;
  public created(): void {
    this.imageEditor?.open('assets/sample-certificate.jpg');
  }

  private syncfusionExportCertificate(): void {
    this.imageEditor?.export();
  }

  private syncfusionInsertValues(): void {
    let dimension: any = this.imageEditor?.getImageDimension();
    this.imageEditor?.drawText(
      dimension?.x,
      dimension?.y,
      this.recipientName,
      'Arial',
      64,
      false,
      false,
      'black'
    );
    this.imageEditor?.drawText(
      dimension?.x,
      dimension?.y + 100,
      this.emissionDate,
      'Arial',
      64,
      false,
      false,
      'black'
    );
    this.imageEditor?.drawText(
      dimension?.x,
      dimension?.y + 200,
      this.certificationTitle,
      'Arial',
      64,
      false,
      false,
      'black'
    );
  }

  private syncfusionExtractTemplates(): void {
    this.extractedTemplate = JSON.stringify(
      this.imageEditor?.getShapeSettings()
    );
  }

  private syncfusionInsertTemplates(): void {
    const shapes = JSON.parse(this.toInsertTemplate);
    shapes.forEach((shape: any) => {
      this.imageEditor?.drawText(
        shape.startX,
        shape.startY,
        shape.text,
        shape.fontFamily,
        shape.fontSize,
        false,
        false,
        shape.color
      );
    });
  }
}
