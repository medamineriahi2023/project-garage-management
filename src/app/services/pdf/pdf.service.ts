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

    // Format date properly
    const formattedDate = new Date(maintenance.date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

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
      const price = item.realPrice.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'TND'
      });
      doc.text(`- ${item.name}: ${price}`, 30, yPos);
      yPos += 10;
    });

    // Add pricing details
    yPos += 10;
    const pricing = [
      {
        label: 'Sous-total',
        value: maintenance.totalPrice.toLocaleString('fr-FR', {
          style: 'currency',
          currency: 'TND'
        })
      },
      {
        label: 'Remise',
        value: maintenance.discount.toLocaleString('fr-FR', {
          style: 'currency',
          currency: 'TND'
        })
      },
      {
        label: 'Prix final',
        value: maintenance.finalPrice.toLocaleString('fr-FR', {
          style: 'currency',
          currency: 'TND'
        })
      }
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
