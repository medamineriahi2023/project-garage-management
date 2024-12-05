import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import {Maintenance} from "../../models";

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  generateMaintenancePdf(maintenance: Maintenance): void {
    const doc = new jsPDF();

    // Set font size for title
    doc.setFontSize(20);
    doc.text('Rapport de Maintenance', 20, 20);

    // Set font size for content
    doc.setFontSize(12);
    // Format date using simple string manipulation
    const date = new Date(maintenance.date);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Add maintenance details
    const details = [
      { label: 'ID', value: maintenance.id.toString() },
      { label: 'Client', value: maintenance.clientName },
      { label: 'Service', value: maintenance.serviceName },
      { label: 'Immatriculation', value: maintenance.carRegistrationNumber },
      { label: 'Date', value: formattedDate },
      { label: 'Assigné à', value: maintenance.assignedToUserName }
    ];

    let yPos = 40;
    details.forEach(detail => {
      doc.text(`${detail.label}: ${detail.value}`, 20, yPos);
      yPos += 10;
    });

    // Add equipment section
    yPos += 10;
    doc.text('Équipement utilisé:', 20, yPos);
    yPos += 10;

    maintenance.equipmentUsed.forEach(item => {
      doc.text(`- ${item.name}: ${item.realPrice} TND`, 30, yPos);
      yPos += 10;
    });

    // Add pricing details
    yPos += 10;
    const pricing = [
      { label: 'Sous-total', value: `${maintenance.totalPrice} TND` },
      { label: 'Remise', value: `${maintenance.discount} TND` },
      { label: 'Prix final', value: `${maintenance.finalPrice} TND` }
    ];

    pricing.forEach(price => {
      doc.text(`${price.label}: ${price.value}`, 20, yPos);
      yPos += 10;
    });

    // Add description if available
    if (maintenance.description) {
      yPos += 10;
      doc.text('Description:', 20, yPos);
      yPos += 10;
      doc.text(maintenance.description, 30, yPos);
    }


    // Save the PDF
    doc.save(`maintenance-${maintenance.id}.pdf`);

  }
}
