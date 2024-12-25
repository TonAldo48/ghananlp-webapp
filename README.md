# GhanaNLP Web

GhanaNLP Web is a web application that enables real-time audio translation into Ghanaian languages. It combines OpenAI's Whisper for transcription with [GhanaNLP](https://ghananlp.org)'s translation services to provide accurate and natural-sounding translations.

## Features

- **Audio Translation**: Upload audio files or record directly in your browser
- **Multiple Input Formats**: Supports MP3, WAV, and M4A audio files
- **Real-time Recording**: Built-in audio recording capabilities
- **Translation History**: Automatically saves all translations for future reference
- **Multiple Languages**: Support for major Ghanaian languages through GhanaNLP's API
- **Responsive Design**: Works on desktop and mobile devices

## Supported Languages

Currently supporting the following Ghanaian languages through GhanaNLP's translation services:
- Twi (Akan)
- Ewe
- Ga
- Dagbani
- More languages coming soon

Visit [GhanaNLP's website](https://ghananlp.org) to learn more about their work in natural language processing for Ghanaian languages.

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ghananlp-web.git
cd ghananlp-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key
GHANA_NLP_API_KEY=your_ghana_nlp_api_key
```

5. Run the development server:
```bash
npm run dev
```

## Usage

### File Upload Method
1. Upload an audio file (MP3, WAV, or M4A)
2. Select your target language
3. Click "Transcribe Audio"
4. Review the transcription
5. Click "Translate"
6. Listen to or download the translated audio

### Live Recording Method
1. Click "Record Audio" in the top menu
2. Select your target language
3. Click the microphone button to start recording
4. Click stop when finished
5. Click "Transcribe & Translate"
6. Review the results

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Audio Processing**: Web Audio API
- **APIs**:
  - OpenAI Whisper API for transcription
  - GhanaNLP API for translation
  - Text-to-Speech for audio generation

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [GhanaNLP](https://ghananlp.org) for their groundbreaking work in Ghanaian language translation services and APIs
- OpenAI for the Whisper API
- The Next.js team for the amazing framework
- shadcn for the beautiful UI components

## About GhanaNLP

GhanaNLP (Ghana Natural Language Processing) is a pioneering project focused on developing natural language processing tools and services for Ghanaian languages. Their mission is to make Ghanaian languages more accessible in the digital age through advanced language technology. Visit their [website](https://ghananlp.org) to learn more about their work and other available services.

---

🔗 [Explore GhanaNLP's Translation Services](https://ghananlp.org)
