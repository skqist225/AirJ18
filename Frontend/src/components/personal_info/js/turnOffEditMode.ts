import $ from 'jquery';

export default function turnOffEditMode(self: JQuery<HTMLElement>) {
    const currentFieldOnEdit = self.siblings('#turnOffEditModeArgs1').val();

    $('.editBtn').each(function () {
        $(this).removeAttr('disabled');
        $(this).removeAttr('style');
    });
    self.removeClass('editMode');
    $('.editBtn').each(function () {
        if ($(this).data('edit') == currentFieldOnEdit) {
            $(this).removeClass('editMode');
            $(this).parent().removeClass('editMode');
            const formEdit = $('.formEdit_' + currentFieldOnEdit, $(this).parent()).first();
            formEdit.removeClass('editMode');
            (
                document.getElementsByClassName(
                    'formEdit_' + currentFieldOnEdit
                )[0] as HTMLFormElement
            ).reset();

            const displayError = $('.c-validation', formEdit);

            displayError.each(function () {
                $(this).addClass('hidden');
            });

            if (currentFieldOnEdit === 'address') {
                $(this).parent().removeClass('needMoreSpace');
            }
            if (currentFieldOnEdit === 'password') {
                $(this).parent().removeClass('passwordArea');
                const displayError = $('.c-validation', formEdit);
                displayError.each(function () {
                    if (!$(this).hasClass('hidden')) $(this).addClass('hidden');
                });
            }

            formEdit.siblings('.displayWhenNormalMode').first().removeClass('editMode');

            return;
        }
    });
}
