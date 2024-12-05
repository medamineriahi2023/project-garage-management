import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Maintenance } from '../models/maintenance.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  generateMaintenancePdf(maintenance: Maintenance): void {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Rapport de Maintenance', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`ID: ${maintenance.id}`, 20, 40);
    doc.text(`Client: ${maintenance.clientName}`, 20, 50);
    doc.text(`Service: ${maintenance.serviceName}`, 20, 60);
    doc.text(`Immatriculation: ${maintenance.carRegistrationNumber}`, 20, 70);
    doc.text(`Date: ${maintenance.date.toLocaleDateString('fr-FR')}`, 20, 80);
    doc.text(`Assigné à: ${maintenance.assignedToUserName}`, 20, 90);
    
    doc.text('Équipement utilisé:', 20, 110);
    let yPos = 120;
    maintenance.equipmentUsed.forEach(item => {
      doc.text(`- ${item.name}: ${item.realPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'TND' })}`, 30, yPos);
      yPos += 10;
    });
    
    doc.text(`Sous-total: ${maintenance.totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'TND' })}`, 20, yPos + 20);
    doc.text(`Remise: ${maintenance.discount.toLocaleString('fr-FR', { style: 'currency', currency: 'TND' })}`, 20, yPos + 30);
    doc.text(`Prix final: ${maintenance.finalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'TND' })}`, 20, yPos + 40);
    
    if (maintenance.description) {
      doc.text('Description:', 20, yPos + 60);
      doc.text(maintenance.description, 30, yPos + 70);
    }
    
    doc.save(`maintenance-${maintenance.id}.pdf`);
  }
}