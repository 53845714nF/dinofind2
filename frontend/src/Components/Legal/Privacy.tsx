
const Privacy: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6 text-gray-800">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>

            <section>
                <h2 className="text-2xl font-semibold mb-2">1. Responsible Party</h2>
                <p><strong>Name:</strong> Sebastian Feustel</p>
                <p><strong>Email:</strong> <a href="mailto:dinofind@hackwiki.de" className="text-blue-600 underline">dinofind@hackwiki.de</a></p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">2. General Information</h2>
                <p>This website does not store any personal data permanently.</p>
                <p>No tracking tools, cookies for profiling, or advertising are used.</p>
                <p>No user accounts or logins are required.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">3. Image Upload and Processing</h2>
                <p>When you upload an image, it is used solely to search for similar images.</p>
                <p>Uploaded files are immediately deleted after processing.</p>
                <p>No permanent storage or further analysis takes place.</p> <br />
                <p className="text-yellow-700 font-medium">⚠️ Important: By uploading an image, you agree that it may be temporarily processed by the system and then deleted.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">4. Server Logs</h2>
                <p>When accessing the website, your browser automatically sends technical data (e.g., IP address, browser type, time of access).</p>
                <p>These are processed by our hosting provider, Contabo GmbH, to maintain the stability and security of the server.</p>
                <p>These logs are not linked to other data and are not used to identify individuals.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">5. Legal Basis</h2>
                <p>The processing of data is based on Article 6(1)(f) GDPR – legitimate interest in providing a functional and secure website.</p>
                <p>If you voluntarily upload an image, this also constitutes implied consent under Article 6(1)(a) GDPR.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">6. Data Retention</h2>
                <p>Uploaded images are deleted immediately after processing.</p>
                <p>Server logs are kept only temporarily for technical and security reasons and are automatically deleted according to the hosting provider’s retention policy.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">7. Contact</h2>
                <p>If you have questions about this Privacy Policy or your data, feel free to contact:</p>
                <p><strong>Sebastian Feustel</strong></p>
                <p>📧 <a href="mailto:dinofind@hackwiki.de" className="text-blue-600 underline">dinofind@hackwiki.de</a></p>
            </section>
        </div>
    )
}

export default Privacy;