/**
 * Utility for downloading the academic MS Word (.docx) source code appendix.
 */
export function downloadSourceCodeAppendixDocx() {
  // Trigger direct browser download of the pre-generated Word document
  const link = document.createElement('a');
  link.href = '/Electronic_Voting_System_Source_Code_Appendix.docx';
  link.setAttribute('download', 'Electronic_Voting_System_Source_Code_Appendix.docx');
  link.setAttribute('target', '_blank');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
