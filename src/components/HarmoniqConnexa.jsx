import React from 'react';
import './HarmoniqConnexa.css';

const CONNEXA_LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 700 150'%3E%3Ctext x='8' y='112' font-family='Arial,sans-serif' font-size='112' font-weight='800' fill='%23000'%3ECONNE%3C/text%3E%3Cpath d='M480 30 L535 85 L480 140 M535 30 L480 85 L535 140 M535 85 L590 30 M535 85 L590 140' fill='none' stroke-width='16' stroke-linecap='round' stroke-linejoin='round' stroke='%23e43b35'/%3E%3Cpath d='M500 85 L550 35 M500 85 L550 135' fill='none' stroke='%23f39b22' stroke-width='15' stroke-linecap='round'/%3E%3Cpath d='M550 85 L600 35 M550 85 L600 135' fill='none' stroke='%234fba54' stroke-width='15' stroke-linecap='round'/%3E%3Cpath d='M525 105 L575 145' fill='none' stroke='%2325a9d6' stroke-width='15' stroke-linecap='round'/%3E%3Ctext x='605' y='112' font-family='Arial,sans-serif' font-size='112' font-weight='800' fill='%23000'%3EA%3C/text%3E%3C/svg%3E";
const HARMONIQ_LOGO = '/harmoniq-logo.svg';
const QR_ROWS = [
  '000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000',
  '000011111110010101111101101110011011111110000',
  '000010000010110100111011101111101010000010000',
  '000010111010001001011110011110100010111010000',
  '000010111010010111001000000011111010111010000',
  '000010111010011100111101101000110010111010000',
  '000010000010100010010101110010001010000010000',
  '000011111110101010101010101010101011111110000',
  '000000000000101011001101000000100000000000000',
  '000000001111000110011110110011110011000100000',
  '000010010000110111010110100010110000100000000',
  '000010011111100000010111110111110100100000000',
  '000010111001011111100110110110111101101010000',
  '000010000011000111010000000000000110001010000',
  '000011000001100111110110100111111100101000000',
  '000011001010010011111111010011011111111000000',
  '000001010100111001101000010110110000001110000',
  '000001001110011101001010011100001111011010000',
  '000000101000100101100100100000011100111000000',
  '000001011111000100001100000111111000101000000',
  '000010101101011101110101111010100101101000000',
  '000011000011100110101010100100110110001000000',
  '000000000101111011111111001010110100101000000',
  '000010101010110101001000111001111000011000000',
  '000001001001000111101111010101001001011010000',
  '000011101010110101010110100111010111001100000',
  '000011101100000011110100001000111100111000000',
  '000000100011101001111001100000011100100000000',
  '000000110000101001011011001010011011101000000',
  '000011011010011111101001101110011111101110000',
  '000000000000111110101000101111101000110100000',
  '000011111110111100010100010110101010111000000',
  '000010000010111111000100001110001000101000000',
  '000010111010110111100001110000001111111010000',
  '000010111010001100110110100010110010011000000',
  '000010111010010110110010000111101011000100000',
  '000010000010011010001011001100110100101100000',
  '000011111110001111000101111010000110001110000',
  '000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000',
];

export default function HarmoniqConnexa() {
  return (
    <section className="harmoniq-section" id="harmoniq-connect" aria-labelledby="harmoniq-title">
      <div className="harmoniq-wrap">
        <div className="harmoniq-partnership-logos">
          <img src={CONNEXA_LOGO} alt="CONNEXA" className="harmoniq-connexa-logo" />
          <span className="harmoniq-times" aria-hidden="true">×</span>
          <img src={HARMONIQ_LOGO} alt="Harmoniq" className="harmoniq-brand-logo" />
        </div>

        <div className="harmoniq-copy">
          <p className="harmoniq-kicker">DIGITAL NETWORKING PARTNER</p>
          <h2 id="harmoniq-title">Walk in ready.<br /><span>Walk out connected.</span></h2>
          <p className="harmoniq-intro">Make meaningful connections at CONNEXA and keep them beyond the room.</p>
        </div>

        <div className="harmoniq-journey">
          <article className="harmoniq-step">
            <span className="harmoniq-step-number">01</span>
            <p className="harmoniq-step-label">BEFORE</p>
            <h3>Make your card.</h3>
            <p>Skip the fumbling at the door.</p>
          </article>
          <article className="harmoniq-step">
            <span className="harmoniq-step-number">02</span>
            <p className="harmoniq-step-label">DURING</p>
            <h3>Swap with everyone you meet.</h3>
            <p>Their card saves to your contacts.</p>
          </article>
          <article className="harmoniq-step">
            <span className="harmoniq-step-number">03</span>
            <p className="harmoniq-step-label">AFTER</p>
            <h3>Every contact is still there.</h3>
            <p>Follow up the same week.</p>
          </article>
        </div>

        <div className="harmoniq-scan-panel">
          <div className="harmoniq-scan-copy">
            <p className="harmoniq-powered">POWERED BY HARMONIQ</p>
            <h3>Make your card before you arrive.</h3>
            <p>Scan the code to create your digital contact card. Then use it to exchange details throughout the day.</p>
            <a className="harmoniq-card-button" href="https://harmoniq.wstech.studio/e/connexa/?src=qr" target="_blank" rel="noreferrer">Make your card</a>
            <small>One scan. Easier introductions. Better follow-ups.</small>
          </div>
          <a className="harmoniq-qr-link" href="https://harmoniq.wstech.studio/e/connexa/?src=qr" target="_blank" rel="noreferrer" aria-label="Scan or open Harmoniq CONNEXA digital card registration">
            <div className="harmoniq-qr-frame">
              <svg viewBox="0 0 45 45" role="img" aria-label="QR code for Harmoniq CONNEXA digital contact cards" shapeRendering="crispEdges">
                <rect width="45" height="45" fill="#fff" />
                {QR_ROWS.map((row, y) => row.split('').map((cell, x) => cell === '1' ? <rect key={y + '-' + x} x={x} y={y} width="1" height="1" fill="#080808" /> : null))}
              </svg>
            </div>
            <span>SCAN TO MAKE YOUR CARD</span>
          </a>
        </div>
      </div>
    </section>
  );
}
